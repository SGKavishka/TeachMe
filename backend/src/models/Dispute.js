import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
      index: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
      index: true
    },
    reason: {
      type: String,
      enum: ["class_not_held", "quality_issue", "teacher_absent", "other"],
      required: true
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000
    },
    status: {
      type: String,
      enum: ["open", "under_review", "resolved", "rejected"],
      default: "open",
      index: true
    },
    resolution: {
      type: String,
      enum: ["none", "release", "partial_refund", "full_refund"],
      default: "none"
    },
    refundAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    adminNotes: String,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    resolvedAt: Date
  },
  { timestamps: true }
);

disputeSchema.index({ booking: 1, status: 1 });

export const Dispute = mongoose.model("Dispute", disputeSchema);
