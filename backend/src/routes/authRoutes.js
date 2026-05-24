import { Router } from "express";
import Joi from "joi";
import { forgotPassword, login, me, register, resetPassword } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post(
  "/register",
  validate(Joi.object({
    name: Joi.string().min(2).max(80).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().allow(""),
    role: Joi.string().valid("student", "teacher").required(),
    password: Joi.string().min(8).required()
  })),
  register
);

router.post(
  "/login",
  validate(Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })),
  login
);

router.get("/me", protect, me);
router.post("/forgot-password", validate(Joi.object({ email: Joi.string().email().required() })), forgotPassword);
router.patch("/reset-password/:token", validate(Joi.object({ password: Joi.string().min(8).required() })), resetPassword);

export default router;

