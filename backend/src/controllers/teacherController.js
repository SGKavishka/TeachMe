import { Teacher } from "../models/Teacher.js";
import { Review } from "../models/Review.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPagination } from "../utils/pagination.js";

const buildTeacherFilter = (query) => {
  const filter = { profileStatus: "published" };

  if (query.search) filter.$text = { $search: query.search };
  if (query.subject) filter["subjects.subject"] = new RegExp(query.subject, "i");
  if (query.topic) filter["subjects.topics"] = new RegExp(query.topic, "i");
  if (query.category) filter["subjects.category"] = new RegExp(query.category, "i");
  if (query.location) filter["location.city"] = new RegExp(query.location, "i");
  if (query.mode === "online") filter["classModes.online"] = true;
  if (query.mode === "physical") filter["classModes.physical"] = true;
  if (query.minRating) filter.ratingAverage = { $gte: Number(query.minRating) };

  if (query.minPrice || query.maxPrice) {
    filter["pricing.hourlyRate"] = {};
    if (query.minPrice) filter["pricing.hourlyRate"].$gte = Number(query.minPrice);
    if (query.maxPrice) filter["pricing.hourlyRate"].$lte = Number(query.maxPrice);
  }

  return filter;
};

export const listTeachers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = buildTeacherFilter(req.query);

  const sort = req.query.sort === "price" ? { "pricing.hourlyRate": 1 } : { ratingAverage: -1, createdAt: -1 };
  const [teachers, total] = await Promise.all([
    Teacher.find(filter).populate("user", "name email avatar phone").sort(sort).skip(skip).limit(limit),
    Teacher.countDocuments(filter)
  ]);

  res.json({
    success: true,
    page,
    pages: Math.ceil(total / limit),
    total,
    data: teachers
  });
});

export const getTeacherById = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id).populate("user", "name email avatar phone");
  if (!teacher) throw new ApiError(404, "Teacher not found");

  const reviews = await Review.find({ teacher: teacher._id })
    .populate("student", "name avatar")
    .sort({ createdAt: -1 })
    .limit(20);

  res.json({ success: true, data: { teacher, reviews } });
});

export const getMyTeacherProfile = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findOne({ user: req.user._id }).populate("user", "name email avatar phone");
  if (!teacher) throw new ApiError(404, "Teacher profile not found");
  res.json({ success: true, data: teacher });
});

export const updateMyTeacherProfile = asyncHandler(async (req, res) => {
  const allowed = [
    "headline",
    "bio",
    "photo",
    "qualifications",
    "experienceYears",
    "subjects",
    "pricing",
    "availability",
    "classModes",
    "location",
    "contact",
    "profileStatus"
  ];

  const updates = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const teacher = await Teacher.findOneAndUpdate({ user: req.user._id }, updates, {
    new: true,
    runValidators: true
  }).populate("user", "name email avatar phone");

  if (!teacher) throw new ApiError(404, "Teacher profile not found");
  res.json({ success: true, data: teacher });
});

