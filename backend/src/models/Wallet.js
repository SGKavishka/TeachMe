import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      index: true
    },
    role: {
      type: String,
      enum: ["teacher", "platform"],
      required: true
    },
    currency: {
      type: String,
      default: "USD"
    },
    pendingBalance: {
      type: Number,
      default: 0,
      min: 0
    },
    availableBalance: {
      type: Number,
      default: 0,
      min: 0
    },
    completedEarnings: {
      type: Number,
      default: 0,
      min: 0
    },
    lifetimeWithdrawn: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active"
    }
  },
  { timestamps: true }
);

walletSchema.index({ owner: 1, currency: 1 }, { unique: true });

export const Wallet = mongoose.model("Wallet", walletSchema);
