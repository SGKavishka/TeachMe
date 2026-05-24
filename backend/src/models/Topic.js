import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    description: String
  },
  { timestamps: true }
);

topicSchema.index({ subject: 1, slug: 1 }, { unique: true });

export const Topic = mongoose.model("Topic", topicSchema);

