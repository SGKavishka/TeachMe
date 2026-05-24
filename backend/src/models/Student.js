import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    level: {
      type: String,
      trim: true
    },
    institution: {
      type: String,
      trim: true
    },
    interests: [String],
    learningGoals: String,
    location: {
      city: String,
      country: String
    }
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);

