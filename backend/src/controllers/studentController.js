import { Student } from "../models/Student.js";
import { Booking } from "../models/Booking.js";
import { Favorite } from "../models/Favorite.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getStudentDashboard = asyncHandler(async (req, res) => {
  const [profile, bookings, favoritesCount] = await Promise.all([
    Student.findOne({ user: req.user._id }),
    Booking.find({ student: req.user._id })
      .populate({ path: "teacher", populate: { path: "user", select: "name avatar" } })
      .sort({ createdAt: -1 })
      .limit(8),
    Favorite.countDocuments({ student: req.user._id })
  ]);

  res.json({ success: true, data: { profile, bookings, favoritesCount } });
});

export const updateStudentProfile = asyncHandler(async (req, res) => {
  const updates = {
    level: req.body.level,
    institution: req.body.institution,
    interests: req.body.interests,
    learningGoals: req.body.learningGoals,
    location: req.body.location
  };

  Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

  const profile = await Student.findOneAndUpdate({ user: req.user._id }, updates, {
    new: true,
    runValidators: true,
    upsert: true
  });

  res.json({ success: true, data: profile });
});

