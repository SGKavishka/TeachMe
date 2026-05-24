import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
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
    provider: {
      type: String,
      enum: ["demo", "stripe_connect"],
      default: "demo"
    },
    providerPaymentId: String,
    providerTransferId: String,
    providerRefundId: String,
    idempotencyKey: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ["pending", "paid", "on_hold", "released", "refunded", "partially_refunded", "failed"],
      default: "pending",
      index: true
    },
    paymentMethod: {
      type: String,
      enum: ["card", "digital_wallet", "bank_transfer", "demo"],
      default: "demo"
    },
    amounts: {
      lessonAmount: {
        type: Number,
        required: true,
        min: 0
      },
      platformFee: {
        type: Number,
        required: true,
        min: 0
      },
      teacherAmount: {
        type: Number,
        required: true,
        min: 0
      },
      finalPayable: {
        type: Number,
        required: true,
        min: 0
      },
      refundedAmount: {
        type: Number,
        default: 0,
        min: 0
      },
      currency: {
        type: String,
        default: "USD"
      }
    },
    risk: {
      score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      flags: [String]
    },
    auditTrail: [
      {
        action: String,
        actor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        at: {
          type: Date,
          default: Date.now
        },
        note: String
      }
    ],
    paidAt: Date,
    heldAt: Date,
    releasedAt: Date,
    refundedAt: Date
  },
  { timestamps: true }
);

paymentSchema.index({ student: 1, createdAt: -1 });
paymentSchema.index({ teacher: 1, createdAt: -1 });

export const Payment = mongoose.model("Payment", paymentSchema);
