import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ["booking", "message", "review", "payment", "dispute", "wallet", "system"],
      default: "system"
    },
    title: {
      type: String,
      required: true
    },
    body: String,
    metadata: {
      type: Map,
      of: String
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
