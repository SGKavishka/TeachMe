import { Router } from "express";
import Joi from "joi";
import { createReview, listTeacherReviews } from "../controllers/reviewController.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/teacher/:teacherId", listTeacherReviews);
router.post(
  "/",
  protect,
  authorize("student"),
  validate(Joi.object({
    teacher: Joi.string().required(),
    booking: Joi.string(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().max(1000).allow("")
  })),
  createReview
);

export default router;

