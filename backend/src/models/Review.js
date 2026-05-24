import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
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
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking"
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000
    }
  },
  { timestamps: true }
);

reviewSchema.index({ student: 1, teacher: 1, booking: 1 }, { unique: true, sparse: true });

export const Review = mongoose.model("Review", reviewSchema);

