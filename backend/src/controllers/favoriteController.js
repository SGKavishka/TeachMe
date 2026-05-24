import { Favorite } from "../models/Favorite.js";
import { Teacher } from "../models/Teacher.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ student: req.user._id })
    .populate({ path: "teacher", populate: { path: "user", select: "name avatar email" } })
    .sort({ createdAt: -1 });

  res.json({ success: true, data: favorites });
});

export const toggleFavorite = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.teacherId);
  if (!teacher) throw new ApiError(404, "Teacher not found");

  const existing = await Favorite.findOne({ student: req.user._id, teacher: teacher._id });
  if (existing) {
    await existing.deleteOne();
    return res.json({ success: true, saved: false });
  }

  await Favorite.create({ student: req.user._id, teacher: teacher._id });
  res.status(201).json({ success: true, saved: true });
});

