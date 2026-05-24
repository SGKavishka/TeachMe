import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    currency: {
      type: String,
      default: "USD"
    },
    status: {
      type: String,
      enum: ["pending", "approved", "paid", "rejected"],
      default: "pending",
      index: true
    },
    method: {
      type: {
        type: String,
        enum: ["bank_transfer", "digital_wallet"],
        default: "bank_transfer"
      },
      accountName: String,
      accountLast4: String,
      provider: String
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    processedAt: Date,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    notes: String
  },
  { timestamps: true }
);

withdrawalSchema.index({ user: 1, createdAt: -1 });

export const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);
