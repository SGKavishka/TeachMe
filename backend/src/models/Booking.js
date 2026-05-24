import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    topic: {
      type: String,
      trim: true
    },
    mode: {
      type: String,
      enum: ["online", "physical"],
      required: true
    },
    preferredSchedule: {
      date: Date,
      time: String
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending"
    },
    price: {
      amount: Number,
      currency: {
        type: String,
        default: "USD"
      }
    },
    notes: String
  },
  { timestamps: true }
);

bookingSchema.index({ student: 1, status: 1 });
bookingSchema.index({ teacher: 1, status: 1 });

export const Booking = mongoose.model("Booking", bookingSchema);

