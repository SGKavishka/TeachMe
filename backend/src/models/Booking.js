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
    sessionDurationMinutes: {
      type: Number,
      min: 15,
      max: 480,
      default: 60
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
      enum: [
        "pending",
        "accepted",
        "rejected",
        "payment_pending",
        "waiting_completion",
        "teacher_completed",
        "completed",
        "cancelled",
        "disputed",
        "refunded"
      ],
      default: "pending"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "on_hold", "released", "refunded", "failed", "partially_refunded"],
      default: "pending"
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment"
    },
    price: {
      amount: Number,
      platformFee: {
        type: Number,
        default: 0
      },
      teacherAmount: {
        type: Number,
        default: 0
      },
      finalAmount: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: "USD"
      }
    },
    completedByTeacherAt: Date,
    confirmedByStudentAt: Date,
    issueReportedAt: Date,
    notes: String
  },
  { timestamps: true }
);

bookingSchema.index({ student: 1, status: 1 });
bookingSchema.index({ teacher: 1, status: 1 });

export const Booking = mongoose.model("Booking", bookingSchema);
