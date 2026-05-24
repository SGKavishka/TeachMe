import { Booking } from "../models/Booking.js";
import { Teacher } from "../models/Teacher.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { notifyUser } from "../services/notificationService.js";

export const createBooking = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.body.teacher).populate("user", "name");
  if (!teacher) throw new ApiError(404, "Teacher not found");

  const booking = await Booking.create({
    student: req.user._id,
    teacher: teacher._id,
    subject: req.body.subject,
    topic: req.body.topic,
    mode: req.body.mode,
    preferredSchedule: req.body.preferredSchedule,
    message: req.body.message,
    price: {
      amount: teacher.pricing.hourlyRate,
      currency: teacher.pricing.currency
    }
  });

  await notifyUser({
    user: teacher.user._id,
    type: "booking",
    title: "New learning request",
    body: `${req.user.name} requested a ${booking.subject} session.`,
    metadata: { bookingId: String(booking._id) }
  });

  res.status(201).json({ success: true, data: booking });
});

export const listMyBookings = asyncHandler(async (req, res) => {
  const filter = req.user.role === "teacher"
    ? { teacher: (await Teacher.findOne({ user: req.user._id }))?._id }
    : { student: req.user._id };

  const bookings = await Booking.find(filter)
    .populate("student", "name email avatar")
    .populate({ path: "teacher", populate: { path: "user", select: "name email avatar" } })
    .sort({ createdAt: -1 });

  res.json({ success: true, data: bookings });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("teacher");
  if (!booking) throw new ApiError(404, "Booking not found");

  const isOwnerTeacher = String(booking.teacher.user) === String(req.user._id);
  const isAdmin = req.user.role === "admin";
  if (!isOwnerTeacher && !isAdmin) throw new ApiError(403, "Only the teacher can update this booking");

  booking.status = req.body.status;
  booking.notes = req.body.notes ?? booking.notes;
  await booking.save();

  await notifyUser({
    user: booking.student,
    type: "booking",
    title: `Request ${booking.status}`,
    body: `Your ${booking.subject} request was ${booking.status}.`,
    metadata: { bookingId: String(booking._id) }
  });

  res.json({ success: true, data: booking });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found");
  if (String(booking.student) !== String(req.user._id) && req.user.role !== "admin") {
    throw new ApiError(403, "You cannot cancel this booking");
  }

  booking.status = "cancelled";
  await booking.save();
  res.json({ success: true, data: booking });
});

