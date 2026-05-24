import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
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
    }
  },
  { timestamps: true }
);

favoriteSchema.index({ student: 1, teacher: 1 }, { unique: true });

export const Favorite = mongoose.model("Favorite", favoriteSchema);

