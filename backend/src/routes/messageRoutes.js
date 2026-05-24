import { Router } from "express";
import Joi from "joi";
import { listConversation, sendMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.use(protect);
router.get("/:userId", listConversation);
router.post(
  "/",
  validate(Joi.object({
    receiver: Joi.string().required(),
    booking: Joi.string(),
    body: Joi.string().max(2000).required()
  })),
  sendMessage
);

export default router;

