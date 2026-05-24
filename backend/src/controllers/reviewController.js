import { Review } from "../models/Review.js";
import { Teacher } from "../models/Teacher.js";
import { Booking } from "../models/Booking.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { notifyUser } from "../services/notificationService.js";

const recalculateTeacherRating = async (teacherId) => {
  const stats = await Review.aggregate([
    { $match: { teacher: teacherId } },
    { $group: { _id: "$teacher", average: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);

  const ratingAverage = stats[0]?.average || 0;
  const ratingCount = stats[0]?.count || 0;
  await Teacher.findByIdAndUpdate(teacherId, { ratingAverage, ratingCount });
};

export const createReview = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.body.teacher);
  if (!teacher) throw new ApiError(404, "Teacher not found");

  if (req.body.booking) {
    const booking = await Booking.findById(req.body.booking);
    if (!booking || String(booking.student) !== String(req.user._id) || booking.status !== "completed") {
      throw new ApiError(400, "Reviews require a completed booking");
    }
  }

  const review = await Review.create({
    student: req.user._id,
    teacher: teacher._id,
    booking: req.body.booking,
    rating: req.body.rating,
    comment: req.body.comment
  });

  await recalculateTeacherRating(teacher._id);
  await notifyUser({
    user: teacher.user,
    type: "review",
    title: "New review",
    body: `${req.user.name} left a ${req.body.rating}-star review.`,
    metadata: { reviewId: String(review._id) }
  });

  res.status(201).json({ success: true, data: review });
});

export const listTeacherReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ teacher: req.params.teacherId })
    .populate("student", "name avatar")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: reviews });
});

