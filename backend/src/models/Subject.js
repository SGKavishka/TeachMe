import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    category: {
      type: String,
      trim: true
    },
    description: String,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const Subject = mongoose.model("Subject", subjectSchema);

