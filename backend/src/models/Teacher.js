import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true
    },
    start: {
      type: String,
      required: true
    },
    end: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    headline: {
      type: String,
      trim: true,
      maxlength: 140
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    photo: String,
    qualifications: [String],
    experienceYears: {
      type: Number,
      min: 0,
      default: 0
    },
    subjects: [
      {
        subject: {
          type: String,
          required: true,
          trim: true
        },
        category: {
          type: String,
          trim: true
        },
        topics: [String]
      }
    ],
    pricing: {
      hourlyRate: {
        type: Number,
        min: 0,
        default: 0
      },
      currency: {
        type: String,
        default: "USD"
      }
    },
    availability: [availabilitySchema],
    classModes: {
      online: {
        type: Boolean,
        default: true
      },
      physical: {
        type: Boolean,
        default: false
      }
    },
    location: {
      city: String,
      country: String,
      address: String
    },
    contact: {
      email: String,
      phone: String,
      website: String
    },
    payout: {
      provider: {
        type: String,
        enum: ["manual", "stripe_connect"],
        default: "manual"
      },
      connectedAccountId: String,
      chargesEnabled: {
        type: Boolean,
        default: false
      },
      payoutsEnabled: {
        type: Boolean,
        default: false
      }
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    ratingCount: {
      type: Number,
      default: 0
    },
    profileStatus: {
      type: String,
      enum: ["draft", "published", "blocked"],
      default: "draft"
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

teacherSchema.index({
  "subjects.subject": "text",
  "subjects.topics": "text",
  headline: "text",
  bio: "text"
});
teacherSchema.index({ "location.city": 1, ratingAverage: -1, "pricing.hourlyRate": 1 });

export const Teacher = mongoose.model("Teacher", teacherSchema);
