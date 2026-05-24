import { Booking } from "../models/Booking.js";
import { Teacher } from "../models/Teacher.js";
import { Payment } from "../models/Payment.js";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { notifyUser } from "../services/notificationService.js";
import { calculateBookingPrice } from "../services/pricingService.js";

export const createBooking = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.body.teacher).populate("user", "name");
  if (!teacher) throw new ApiError(404, "Teacher not found");

  const sessionDurationMinutes = req.body.sessionDurationMinutes || 60;
  const price = calculateBookingPrice({
    hourlyRate: teacher.pricing.hourlyRate,
    durationMinutes: sessionDurationMinutes,
    currency: teacher.pricing.currency,
    platformFeePercent: env.platformFeePercent
  });

  const booking = await Booking.create({
    student: req.user._id,
    teacher: teacher._id,
    subject: req.body.subject,
    topic: req.body.topic,
    mode: req.body.mode,
    sessionDurationMinutes,
    preferredSchedule: req.body.preferredSchedule,
    message: req.body.message,
    price: {
      amount: price.lessonAmount,
      platformFee: price.platformFee,
      teacherAmount: price.teacherAmount,
      finalAmount: price.finalPayable,
      currency: price.currency
    }
  });

  await notifyUser({
    user: teacher.user._id,
    type: "booking",
    title: "New learning request",
    body: `${req.user.name} requested a ${booking.subject} session.`,
    metadata: { bookingId: String(booking._id) }
  });

  res.status(201).json({ success: true, data: booking });
});

export const listMyBookings = asyncHandler(async (req, res) => {
  const filter = req.user.role === "teacher"
    ? { teacher: (await Teacher.findOne({ user: req.user._id }))?._id }
    : { student: req.user._id };

  const bookings = await Booking.find(filter)
    .populate("student", "name email avatar")
    .populate({ path: "teacher", populate: { path: "user", select: "name email avatar" } })
    .sort({ createdAt: -1 });

  res.json({ success: true, data: bookings });
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("student", "name email avatar")
    .populate({ path: "teacher", populate: { path: "user", select: "name email avatar" } })
    .populate("payment");
  if (!booking) throw new ApiError(404, "Booking not found");

  const isStudent = String(booking.student._id) === String(req.user._id);
  const isTeacher = String(booking.teacher.user._id) === String(req.user._id);
  const isAdmin = req.user.role === "admin";
  if (!isStudent && !isTeacher && !isAdmin) throw new ApiError(403, "You cannot view this booking");

  res.json({ success: true, data: booking });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("teacher");
  if (!booking) throw new ApiError(404, "Booking not found");

  const isOwnerTeacher = String(booking.teacher.user) === String(req.user._id);
  const isAdmin = req.user.role === "admin";
  if (!isOwnerTeacher && !isAdmin) throw new ApiError(403, "Only the teacher can update this booking");

  if (req.body.status === "completed") {
    const payment = await Payment.findById(booking.payment);
    if (!payment || payment.status !== "on_hold") {
      throw new ApiError(409, "Payment must be received and held before the class can be completed.");
    }

    booking.status = "teacher_completed";
    booking.completedByTeacherAt = new Date();
    booking.notes = req.body.notes ?? booking.notes;
    await booking.save();

    await notifyUser({
      user: booking.student,
      type: "booking",
      title: "Did the class happen successfully?",
      body: `Please confirm the ${booking.subject} class so payment can be released, or report an issue for admin review.`,
      metadata: { bookingId: String(booking._id), paymentId: String(payment._id) }
    });

    return res.json({ success: true, data: booking });
  }

  booking.status = req.body.status;
  booking.notes = req.body.notes ?? booking.notes;
  await booking.save();

  await notifyUser({
    user: booking.student,
    type: "booking",
    title: `Request ${booking.status}`,
    body: booking.status === "accepted"
      ? `Your ${booking.subject} request was accepted. Complete payment to secure the booking.`
      : `Your ${booking.subject} request was ${booking.status}.`,
    metadata: { bookingId: String(booking._id) }
  });

  res.json({ success: true, data: booking });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found");
  if (String(booking.student) !== String(req.user._id) && req.user.role !== "admin") {
    throw new ApiError(403, "You cannot cancel this booking");
  }

  booking.status = "cancelled";
  await booking.save();
  res.json({ success: true, data: booking });
});
