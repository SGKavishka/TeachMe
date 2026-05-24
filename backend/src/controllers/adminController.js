import { User } from "../models/User.js";
import { Teacher } from "../models/Teacher.js";
import { Booking } from "../models/Booking.js";
import { Dispute } from "../models/Dispute.js";
import { Payment } from "../models/Payment.js";
import { Review } from "../models/Review.js";
import { Withdrawal } from "../models/Withdrawal.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAdminAnalytics = asyncHandler(async (req, res) => {
  const [users, students, teachers, bookings, reviews, pendingTeachers, heldPayments, openDisputes, pendingWithdrawals] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "teacher" }),
    Booking.countDocuments(),
    Review.countDocuments(),
    Teacher.countDocuments({ profileStatus: "draft" }),
    Payment.countDocuments({ status: "on_hold" }),
    Dispute.countDocuments({ status: { $in: ["open", "under_review"] } }),
    Withdrawal.countDocuments({ status: "pending" })
  ]);

  res.json({
    success: true,
    data: { users, students, teachers, bookings, reviews, pendingTeachers, heldPayments, openDisputes, pendingWithdrawals }
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, data: users });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  if (String(req.user._id) === req.params.id) throw new ApiError(400, "You cannot change your own status");

  const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!user) throw new ApiError(404, "User not found");

  res.json({ success: true, data: user });
});

export const updateTeacherModeration = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findByIdAndUpdate(
    req.params.id,
    { profileStatus: req.body.profileStatus, isVerified: req.body.isVerified },
    { new: true, runValidators: true }
  );
  if (!teacher) throw new ApiError(404, "Teacher not found");

  res.json({ success: true, data: teacher });
});
