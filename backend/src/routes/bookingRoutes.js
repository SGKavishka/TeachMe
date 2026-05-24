import { Router } from "express";
import Joi from "joi";
import { cancelBooking, createBooking, listMyBookings, updateBookingStatus } from "../controllers/bookingController.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(protect);
router.get("/", listMyBookings);
router.post(
  "/",
  authorize("student"),
  validate(Joi.object({
    teacher: Joi.string().required(),
    subject: Joi.string().required(),
    topic: Joi.string().allow(""),
    mode: Joi.string().valid("online", "physical").required(),
    preferredSchedule: Joi.object({
      date: Joi.date(),
      time: Joi.string().allow("")
    }),
    message: Joi.string().max(1000).allow("")
  })),
  createBooking
);
router.patch(
  "/:id/status",
  authorize("teacher", "admin"),
  validate(Joi.object({
    status: Joi.string().valid("accepted", "rejected", "completed").required(),
    notes: Joi.string().allow("")
  })),
  updateBookingStatus
);
router.patch("/:id/cancel", authorize("student", "admin"), cancelBooking);

export default router;

