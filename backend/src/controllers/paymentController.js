import crypto from "crypto";
import { Booking } from "../models/Booking.js";
import { Dispute } from "../models/Dispute.js";
import { Payment } from "../models/Payment.js";
import { Teacher } from "../models/Teacher.js";
import { Transaction } from "../models/Transaction.js";
import { User } from "../models/User.js";
import { Wallet } from "../models/Wallet.js";
import { Withdrawal } from "../models/Withdrawal.js";
import { env } from "../config/env.js";
import { notifyUser } from "../services/notificationService.js";
import { processPayment, refundPayment, transferPayment } from "../services/paymentGateway.js";
import { calculateBookingPrice } from "../services/pricingService.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const roundMoney = (value) => Math.round((Number(value) || 0) * 100) / 100;

const getTeacherWallet = async (teacherRef, currency) => {
  const teacher = teacherRef.user ? teacherRef : await Teacher.findById(teacherRef).select("user");
  if (!teacher) throw new ApiError(404, "Teacher not found");

  return Wallet.findOneAndUpdate(
    { owner: teacher.user, currency },
    {
      $setOnInsert: {
        owner: teacher.user,
        teacher: teacher._id,
        role: "teacher",
        currency
      }
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
};

const notifyAdmins = async ({ title, body, metadata = {}, type = "system" }) => {
  const admins = await User.find({ role: "admin", status: "active" }).select("_id");
  await Promise.all(admins.map((admin) => notifyUser({ user: admin._id, type, title, body, metadata })));
};

const createTransaction = (payload) => Transaction.create({
  ...payload,
  reference: payload.reference || crypto.randomBytes(12).toString("hex")
});

const getBookingWithTeacher = (bookingId) => Booking.findById(bookingId).populate({
  path: "teacher",
  populate: { path: "user", select: "name email avatar" }
});

const buildPaymentSummary = async (payment) => {
  await payment.populate([
    { path: "student", select: "name email avatar" },
    { path: "booking" },
    { path: "teacher", populate: { path: "user", select: "name email avatar" } }
  ]);
  return payment;
};

const assertStudentOwnsBooking = (booking, user) => {
  if (String(booking.student) !== String(user._id)) {
    throw new ApiError(403, "You cannot manage payments for this booking");
  }
};

const getAuthorisedTransactionFilter = async (user) => {
  if (user.role === "admin") return {};
  if (user.role === "teacher") {
    const teacher = await Teacher.findOne({ user: user._id }).select("_id");
    if (!teacher) return { user: user._id };
  }
  return { user: user._id };
};

const calculateCurrentBookingPrice = (booking) => {
  const hourlyRate = booking.teacher?.pricing?.hourlyRate || booking.price?.amount || 0;
  const currency = booking.teacher?.pricing?.currency || booking.price?.currency || "USD";
  return calculateBookingPrice({
    hourlyRate,
    durationMinutes: booking.sessionDurationMinutes,
    currency,
    platformFeePercent: env.platformFeePercent
  });
};

const releasePaymentToTeacher = async ({ booking, payment, actor, note, releaseAmount }) => {
  if (payment.status !== "on_hold") {
    throw new ApiError(409, "Only payments on hold can be released.");
  }

  const amountToRelease = roundMoney(releaseAmount ?? payment.amounts.teacherAmount);
  const transferResult = amountToRelease > 0
    ? await transferPayment({ provider: payment.provider, amount: amountToRelease })
    : null;
  const wallet = await getTeacherWallet(booking.teacher, payment.amounts.currency);

  wallet.pendingBalance = roundMoney(Math.max(0, wallet.pendingBalance - payment.amounts.teacherAmount));
  wallet.availableBalance = roundMoney(wallet.availableBalance + amountToRelease);
  wallet.completedEarnings = roundMoney(wallet.completedEarnings + amountToRelease);
  await wallet.save();

  payment.status = "released";
  payment.providerTransferId = transferResult?.providerTransferId || payment.providerTransferId;
  payment.releasedAt = new Date();
  payment.auditTrail.push({ action: "released", actor: actor._id, note });
  await payment.save();

  booking.status = "completed";
  booking.paymentStatus = "released";
  booking.confirmedByStudentAt = actor.role === "student" ? new Date() : booking.confirmedByStudentAt;
  await booking.save();

  await createTransaction({
    user: booking.teacher.user || booking.teacher,
    booking: booking._id,
    payment: payment._id,
    wallet: wallet._id,
    type: "release",
    direction: "credit",
    status: "completed",
    amount: amountToRelease,
    currency: payment.amounts.currency,
    description: "Escrow payment released to tutor wallet",
    reference: `release_${payment._id}`,
    createdBy: actor._id
  });

  return { booking, payment, wallet };
};

export const createPaymentForBooking = asyncHandler(async (req, res) => {
  const booking = await getBookingWithTeacher(req.params.bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");
  assertStudentOwnsBooking(booking, req.user);

  if (["rejected", "cancelled", "disputed", "refunded"].includes(booking.status)) {
    throw new ApiError(409, "This booking cannot be paid.");
  }

  const existingByKey = req.body.idempotencyKey
    ? await Payment.findOne({ idempotencyKey: req.body.idempotencyKey })
    : null;
  if (existingByKey) {
    if (String(existingByKey.booking) !== String(booking._id) || String(existingByKey.student) !== String(req.user._id)) {
      throw new ApiError(409, "Idempotency key already belongs to a different payment.");
    }
    return res.json({ success: true, data: await buildPaymentSummary(existingByKey) });
  }

  const existingPayment = await Payment.findOne({ booking: booking._id });
  if (existingPayment && existingPayment.status !== "failed") {
    return res.json({ success: true, data: await buildPaymentSummary(existingPayment) });
  }

  const recentPayments = await Payment.countDocuments({
    student: req.user._id,
    createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) },
    status: { $in: ["paid", "on_hold", "released"] }
  });
  if (recentPayments >= 12) throw new ApiError(429, "Too many recent payment attempts. Please try again later.");

  const amounts = calculateCurrentBookingPrice(booking);
  if (amounts.finalPayable <= 0) throw new ApiError(400, "Booking price must be greater than zero.");
  if (amounts.finalPayable > 10000) throw new ApiError(400, "Payment amount requires manual review.");

  const idempotencyKey = req.body.idempotencyKey || `booking_${booking._id}_${crypto.randomBytes(8).toString("hex")}`;
  const gatewayResult = await processPayment({
    provider: env.paymentProvider,
    amount: amounts.finalPayable,
    currency: amounts.currency,
    paymentMethod: req.body.paymentMethod,
    paymentToken: req.body.paymentToken,
    idempotencyKey
  });

  const payment = await Payment.create({
    booking: booking._id,
    student: req.user._id,
    teacher: booking.teacher._id,
    provider: env.paymentProvider,
    providerPaymentId: gatewayResult.providerPaymentId,
    idempotencyKey,
    status: gatewayResult.status === "paid" ? "on_hold" : gatewayResult.status,
    paymentMethod: req.body.paymentMethod,
    amounts,
    risk: gatewayResult.risk,
    paidAt: new Date(),
    heldAt: new Date(),
    auditTrail: [{ action: "paid_and_held", actor: req.user._id, note: "Payment captured by platform and held for tutor release." }]
  });

  const wallet = await getTeacherWallet(booking.teacher, amounts.currency);
  wallet.pendingBalance = roundMoney(wallet.pendingBalance + amounts.teacherAmount);
  await wallet.save();

  booking.payment = payment._id;
  booking.status = "waiting_completion";
  booking.paymentStatus = "on_hold";
  booking.price = {
    amount: amounts.lessonAmount,
    platformFee: amounts.platformFee,
    teacherAmount: amounts.teacherAmount,
    finalAmount: amounts.finalPayable,
    currency: amounts.currency
  };
  await booking.save();

  await Promise.all([
    createTransaction({
      user: req.user._id,
      booking: booking._id,
      payment: payment._id,
      type: "payment",
      direction: "debit",
      status: "completed",
      amount: amounts.finalPayable,
      currency: amounts.currency,
      description: "Student payment captured by platform",
      reference: `student_payment_${payment._id}`,
      createdBy: req.user._id
    }),
    createTransaction({
      user: booking.teacher.user._id,
      booking: booking._id,
      payment: payment._id,
      wallet: wallet._id,
      type: "escrow_hold",
      direction: "credit",
      status: "pending",
      amount: amounts.teacherAmount,
      currency: amounts.currency,
      description: "Tutor earnings held until class completion",
      reference: `escrow_hold_${payment._id}`,
      createdBy: req.user._id
    })
  ]);

  await Promise.all([
    notifyUser({
      user: req.user._id,
      type: "payment",
      title: "Payment received",
      body: `Your ${booking.subject} payment is held securely until the class is completed.`,
      metadata: { bookingId: String(booking._id), paymentId: String(payment._id) }
    }),
    notifyUser({
      user: booking.teacher.user._id,
      type: "payment",
      title: "Payment received and on hold",
      body: `${req.user.name} paid for ${booking.subject}. Complete the class to request release.`,
      metadata: { bookingId: String(booking._id), paymentId: String(payment._id) }
    })
  ]);

  res.status(201).json({ success: true, data: await buildPaymentSummary(payment) });
});

export const holdPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.paymentId);
  if (!payment) throw new ApiError(404, "Payment not found");

  if (payment.status === "paid") {
    payment.status = "on_hold";
    payment.heldAt = new Date();
    payment.auditTrail.push({ action: "held", actor: req.user._id, note: "Payment moved to escrow hold." });
    await payment.save();
  }

  res.json({ success: true, data: await buildPaymentSummary(payment) });
});

export const confirmClassCompletion = asyncHandler(async (req, res) => {
  const booking = await getBookingWithTeacher(req.params.bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");
  assertStudentOwnsBooking(booking, req.user);

  if (booking.status !== "teacher_completed") {
    throw new ApiError(409, "The teacher must mark the class completed before payment can be released.");
  }

  const payment = await Payment.findById(booking.payment);
  if (!payment) throw new ApiError(404, "Payment not found");

  const result = await releasePaymentToTeacher({
    booking,
    payment,
    actor: req.user,
    note: "Student confirmed class completion."
  });

  await Promise.all([
    notifyUser({
      user: booking.teacher.user._id,
      type: "payment",
      title: "Payment released",
      body: `Your ${booking.subject} earnings are now available in your wallet.`,
      metadata: { bookingId: String(booking._id), paymentId: String(payment._id) }
    }),
    notifyUser({
      user: req.user._id,
      type: "booking",
      title: "Class completed",
      body: "Thanks for confirming. A receipt was added to your payment history.",
      metadata: { bookingId: String(booking._id), paymentId: String(payment._id) }
    })
  ]);

  res.json({ success: true, data: result });
});

export const createDispute = asyncHandler(async (req, res) => {
  const booking = await getBookingWithTeacher(req.params.bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");
  assertStudentOwnsBooking(booking, req.user);

  if (!["waiting_completion", "teacher_completed", "disputed"].includes(booking.status)) {
    throw new ApiError(409, "Only paid bookings waiting for completion can be disputed.");
  }

  const payment = await Payment.findById(booking.payment);
  if (!payment || payment.status !== "on_hold") {
    throw new ApiError(409, "Only payments currently on hold can be disputed.");
  }

  const existing = await Dispute.findOne({ booking: booking._id, status: { $in: ["open", "under_review"] } });
  if (existing) return res.json({ success: true, data: existing });

  const dispute = await Dispute.create({
    booking: booking._id,
    payment: payment._id,
    student: req.user._id,
    teacher: booking.teacher._id,
    reason: req.body.reason,
    description: req.body.description
  });

  booking.status = "disputed";
  booking.issueReportedAt = new Date();
  await booking.save();

  payment.auditTrail.push({ action: "disputed", actor: req.user._id, note: req.body.reason });
  await payment.save();

  await Promise.all([
    notifyUser({
      user: booking.teacher.user._id,
      type: "dispute",
      title: "Payment dispute opened",
      body: `${req.user.name} reported an issue for ${booking.subject}. Payment remains on hold.`,
      metadata: { bookingId: String(booking._id), disputeId: String(dispute._id) }
    }),
    notifyAdmins({
      type: "dispute",
      title: "New booking dispute",
      body: `${req.user.name} opened a dispute for ${booking.subject}.`,
      metadata: { bookingId: String(booking._id), disputeId: String(dispute._id) }
    })
  ]);

  res.status(201).json({ success: true, data: dispute });
});

export const resolveDispute = asyncHandler(async (req, res) => {
  const dispute = await Dispute.findById(req.params.id)
    .populate("payment")
    .populate({
      path: "booking",
      populate: { path: "teacher", populate: { path: "user", select: "name email avatar" } }
    });
  if (!dispute) throw new ApiError(404, "Dispute not found");
  if (["resolved", "rejected"].includes(dispute.status)) throw new ApiError(409, "Dispute is already closed.");

  const booking = dispute.booking;
  const payment = dispute.payment;
  if (!booking || !payment) throw new ApiError(404, "Linked booking or payment not found");

  if (req.body.resolution === "release") {
    await releasePaymentToTeacher({
      booking,
      payment,
      actor: req.user,
      note: "Admin resolved dispute by releasing payment."
    });
    dispute.status = "resolved";
    dispute.resolution = "release";
    dispute.refundAmount = 0;
  } else {
    if (payment.status !== "on_hold") throw new ApiError(409, "Only held payments can be refunded from a dispute.");

    const fullPayable = payment.amounts.finalPayable;
    const requestedRefund = req.body.resolution === "full_refund" ? fullPayable : roundMoney(req.body.refundAmount);
    if (requestedRefund <= 0 || requestedRefund > fullPayable) throw new ApiError(400, "Invalid refund amount.");
    if (req.body.resolution === "partial_refund" && requestedRefund >= fullPayable) {
      throw new ApiError(400, "Use full refund when refunding the full payable amount.");
    }

    const teacherReleaseAmount = roundMoney(Math.min(
      payment.amounts.teacherAmount,
      Math.max(0, fullPayable - requestedRefund - payment.amounts.platformFee)
    ));
    const refundResult = await refundPayment({ provider: payment.provider, amount: requestedRefund });
    const transferResult = teacherReleaseAmount > 0
      ? await transferPayment({ provider: payment.provider, amount: teacherReleaseAmount })
      : null;
    const wallet = await getTeacherWallet(booking.teacher, payment.amounts.currency);

    wallet.pendingBalance = roundMoney(Math.max(0, wallet.pendingBalance - payment.amounts.teacherAmount));
    wallet.availableBalance = roundMoney(wallet.availableBalance + teacherReleaseAmount);
    wallet.completedEarnings = roundMoney(wallet.completedEarnings + teacherReleaseAmount);
    await wallet.save();

    payment.status = teacherReleaseAmount > 0 ? "partially_refunded" : "refunded";
    payment.amounts.refundedAmount = roundMoney(payment.amounts.refundedAmount + requestedRefund);
    payment.providerRefundId = refundResult.providerRefundId;
    payment.providerTransferId = transferResult?.providerTransferId || payment.providerTransferId;
    payment.refundedAt = new Date();
    payment.releasedAt = teacherReleaseAmount > 0 ? new Date() : payment.releasedAt;
    payment.auditTrail.push({ action: req.body.resolution, actor: req.user._id, note: req.body.adminNotes });
    await payment.save();

    booking.status = teacherReleaseAmount > 0 ? "completed" : "refunded";
    booking.paymentStatus = payment.status;
    await booking.save();

    await Promise.all([
      createTransaction({
        user: dispute.student,
        booking: booking._id,
        payment: payment._id,
        dispute: dispute._id,
        type: "refund",
        direction: "credit",
        status: "completed",
        amount: requestedRefund,
        currency: payment.amounts.currency,
        description: "Refund issued after dispute review",
        reference: `refund_${payment._id}`,
        createdBy: req.user._id
      }),
      teacherReleaseAmount > 0 ? createTransaction({
        user: booking.teacher.user._id,
        booking: booking._id,
        payment: payment._id,
        wallet: wallet._id,
        dispute: dispute._id,
        type: "release",
        direction: "credit",
        status: "completed",
        amount: teacherReleaseAmount,
        currency: payment.amounts.currency,
        description: "Partial release after dispute review",
        reference: `dispute_release_${payment._id}`,
        createdBy: req.user._id
      }) : Promise.resolve()
    ]);

    dispute.status = "resolved";
    dispute.resolution = req.body.resolution;
    dispute.refundAmount = requestedRefund;
  }

  dispute.adminNotes = req.body.adminNotes;
  dispute.reviewedBy = req.user._id;
  dispute.resolvedAt = new Date();
  await dispute.save();

  await Promise.all([
    notifyUser({
      user: dispute.student,
      type: "dispute",
      title: "Dispute resolved",
      body: `Your dispute was resolved with: ${dispute.resolution.replace("_", " ")}.`,
      metadata: { bookingId: String(booking._id), disputeId: String(dispute._id) }
    }),
    notifyUser({
      user: booking.teacher.user._id,
      type: "dispute",
      title: "Dispute resolved",
      body: `Admin resolved the ${booking.subject} dispute with: ${dispute.resolution.replace("_", " ")}.`,
      metadata: { bookingId: String(booking._id), disputeId: String(dispute._id) }
    })
  ]);

  res.json({ success: true, data: dispute });
});

export const getWalletSummary = asyncHandler(async (req, res) => {
  if (req.user.role === "teacher") {
    const teacher = await Teacher.findOne({ user: req.user._id });
    if (!teacher) throw new ApiError(404, "Teacher profile not found");
    const wallet = await getTeacherWallet(teacher, teacher.pricing?.currency || "USD");
    const [transactions, withdrawals, payments] = await Promise.all([
      Transaction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(30),
      Withdrawal.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20),
      Payment.find({ teacher: teacher._id }).populate("booking").sort({ createdAt: -1 }).limit(20)
    ]);
    return res.json({ success: true, data: { wallet, transactions, withdrawals, payments } });
  }

  if (req.user.role === "admin") {
    const [payments, openDisputes, pendingWithdrawals, recentTransactions] = await Promise.all([
      Payment.find().populate("booking").sort({ createdAt: -1 }).limit(20),
      Dispute.countDocuments({ status: { $in: ["open", "under_review"] } }),
      Withdrawal.countDocuments({ status: "pending" }),
      Transaction.find().sort({ createdAt: -1 }).limit(30)
    ]);
    const totals = await Payment.aggregate([
      { $match: { status: { $in: ["on_hold", "released", "partially_refunded", "refunded"] } } },
      {
        $group: {
          _id: "$amounts.currency",
          volume: { $sum: "$amounts.finalPayable" },
          platformFees: { $sum: "$amounts.platformFee" },
          refunded: { $sum: "$amounts.refundedAmount" }
        }
      }
    ]);
    return res.json({ success: true, data: { payments, openDisputes, pendingWithdrawals, recentTransactions, totals } });
  }

  const [transactions, payments] = await Promise.all([
    Transaction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(30),
    Payment.find({ student: req.user._id }).populate("booking").sort({ createdAt: -1 }).limit(20)
  ]);
  res.json({ success: true, data: { transactions, payments } });
});

export const listTransactions = asyncHandler(async (req, res) => {
  const filter = await getAuthorisedTransactionFilter(req.user);
  const transactions = await Transaction.find(filter)
    .populate("booking", "subject topic mode status paymentStatus preferredSchedule")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ success: true, data: transactions });
});

export const requestWithdrawal = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user._id });
  if (!teacher) throw new ApiError(404, "Teacher profile not found");

  const currency = req.body.currency || teacher.pricing?.currency || "USD";
  const amount = roundMoney(req.body.amount);
  const wallet = await getTeacherWallet(teacher, currency);
  if (wallet.status !== "active") throw new ApiError(403, "Wallet is not active.");
  if (wallet.availableBalance < amount) throw new ApiError(400, "Insufficient available balance.");

  wallet.availableBalance = roundMoney(wallet.availableBalance - amount);
  await wallet.save();

  const withdrawal = await Withdrawal.create({
    teacher: teacher._id,
    user: req.user._id,
    wallet: wallet._id,
    amount,
    currency,
    method: req.body.method
  });

  await createTransaction({
    user: req.user._id,
    wallet: wallet._id,
    withdrawal: withdrawal._id,
    type: "withdrawal",
    direction: "debit",
    status: "pending",
    amount,
    currency,
    description: "Tutor withdrawal requested",
    reference: `withdrawal_${withdrawal._id}`,
    createdBy: req.user._id
  });

  await notifyAdmins({
    type: "wallet",
    title: "Withdrawal requested",
    body: `${req.user.name} requested a ${currency} ${amount} withdrawal.`,
    metadata: { withdrawalId: String(withdrawal._id) }
  });

  res.status(201).json({ success: true, data: withdrawal });
});

export const listWithdrawals = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { user: req.user._id };
  const withdrawals = await Withdrawal.find(filter).populate("user", "name email").sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, data: withdrawals });
});

export const updateWithdrawalStatus = asyncHandler(async (req, res) => {
  const withdrawal = await Withdrawal.findById(req.params.id).populate("wallet");
  if (!withdrawal) throw new ApiError(404, "Withdrawal not found");
  if (withdrawal.status === "paid" || withdrawal.status === "rejected") {
    throw new ApiError(409, "Withdrawal is already closed.");
  }

  withdrawal.status = req.body.status;
  withdrawal.notes = req.body.notes ?? withdrawal.notes;
  withdrawal.processedBy = req.user._id;
  withdrawal.processedAt = new Date();

  if (req.body.status === "paid") {
    withdrawal.wallet.lifetimeWithdrawn = roundMoney(withdrawal.wallet.lifetimeWithdrawn + withdrawal.amount);
    await withdrawal.wallet.save();
    await Transaction.findOneAndUpdate({ withdrawal: withdrawal._id, type: "withdrawal" }, { status: "completed" });
  }

  if (req.body.status === "rejected") {
    withdrawal.wallet.availableBalance = roundMoney(withdrawal.wallet.availableBalance + withdrawal.amount);
    await withdrawal.wallet.save();
    await Transaction.findOneAndUpdate({ withdrawal: withdrawal._id, type: "withdrawal" }, { status: "reversed" });
  }

  await withdrawal.save();

  await notifyUser({
    user: withdrawal.user,
    type: "wallet",
    title: "Withdrawal updated",
    body: `Your withdrawal is now ${withdrawal.status}.`,
    metadata: { withdrawalId: String(withdrawal._id) }
  });

  res.json({ success: true, data: withdrawal });
});

export const listDisputes = asyncHandler(async (req, res) => {
  let filter = {};
  if (req.user.role === "student") filter.student = req.user._id;
  if (req.user.role === "teacher") {
    const teacher = await Teacher.findOne({ user: req.user._id }).select("_id");
    filter.teacher = teacher?._id;
  }

  const disputes = await Dispute.find(filter)
    .populate("student", "name email")
    .populate({ path: "teacher", populate: { path: "user", select: "name email" } })
    .populate("booking", "subject topic status paymentStatus")
    .sort({ createdAt: -1 })
    .limit(100);
  res.json({ success: true, data: disputes });
});
