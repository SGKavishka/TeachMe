import { Router } from "express";
import Joi from "joi";
import {
  confirmClassCompletion,
  createDispute,
  createPaymentForBooking,
  getWalletSummary,
  holdPayment,
  listDisputes,
  listTransactions,
  listWithdrawals,
  requestWithdrawal,
  resolveDispute,
  updateWithdrawalStatus
} from "../controllers/paymentController.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(protect);

router.get("/wallet", authorize("student", "teacher", "admin"), getWalletSummary);
router.get("/transactions", authorize("student", "teacher", "admin"), listTransactions);

router.post(
  "/bookings/:bookingId/pay",
  authorize("student"),
  validate(Joi.object({
    paymentMethod: Joi.string().valid("card", "digital_wallet", "bank_transfer", "demo").default("demo"),
    paymentToken: Joi.string().max(200).allow(""),
    idempotencyKey: Joi.string().max(120).allow("")
  })),
  createPaymentForBooking
);
router.post("/bookings/:bookingId/confirm-completion", authorize("student"), confirmClassCompletion);
router.post(
  "/bookings/:bookingId/disputes",
  authorize("student"),
  validate(Joi.object({
    reason: Joi.string().valid("class_not_held", "quality_issue", "teacher_absent", "other").required(),
    description: Joi.string().min(10).max(2000).required()
  })),
  createDispute
);

router.post("/:paymentId/hold", authorize("admin"), holdPayment);

router.get("/disputes", authorize("student", "teacher", "admin"), listDisputes);
router.patch(
  "/disputes/:id/resolve",
  authorize("admin"),
  validate(Joi.object({
    resolution: Joi.string().valid("release", "partial_refund", "full_refund").required(),
    refundAmount: Joi.number().min(0).default(0),
    adminNotes: Joi.string().max(2000).allow("")
  })),
  resolveDispute
);

router.get("/withdrawals", authorize("teacher", "admin"), listWithdrawals);
router.post(
  "/withdrawals",
  authorize("teacher"),
  validate(Joi.object({
    amount: Joi.number().positive().required(),
    currency: Joi.string().length(3).uppercase().default("USD"),
    method: Joi.object({
      type: Joi.string().valid("bank_transfer", "digital_wallet").default("bank_transfer"),
      accountName: Joi.string().max(120).allow(""),
      accountLast4: Joi.string().max(4).allow(""),
      provider: Joi.string().max(80).allow("")
    }).required()
  })),
  requestWithdrawal
);
router.patch(
  "/withdrawals/:id/status",
  authorize("admin"),
  validate(Joi.object({
    status: Joi.string().valid("approved", "paid", "rejected").required(),
    notes: Joi.string().max(1000).allow("")
  })),
  updateWithdrawalStatus
);

export default router;
