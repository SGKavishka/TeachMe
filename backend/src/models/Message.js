import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking"
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    readAt: Date
  },
  { timestamps: true }
);

messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

export const Message = mongoose.model("Message", messageSchema);

