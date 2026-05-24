import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      index: true
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      index: true
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet"
    },
    withdrawal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Withdrawal"
    },
    dispute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dispute"
    },
    type: {
      type: String,
      enum: ["payment", "escrow_hold", "release", "refund", "platform_fee", "withdrawal", "adjustment"],
      required: true,
      index: true
    },
    direction: {
      type: String,
      enum: ["debit", "credit"],
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "reversed"],
      default: "completed"
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: "USD"
    },
    description: String,
    reference: {
      type: String,
      required: true,
      index: true
    },
    metadata: {
      type: Map,
      of: String
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ reference: 1, type: 1 });

export const Transaction = mongoose.model("Transaction", transactionSchema);
