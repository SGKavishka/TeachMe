import crypto from "crypto";
import { User } from "../models/User.js";
import { Student } from "../models/Student.js";
import { Teacher } from "../models/Teacher.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendTokenResponse } from "../services/tokenService.js";
import { sendEmail } from "../services/emailService.js";
import { env } from "../config/env.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role = "student", phone } = req.body;

  if (role === "admin") throw new ApiError(403, "Admin accounts cannot be self-registered");

  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, "Email is already registered");

  const user = await User.create({ name, email, password, role, phone });

  if (role === "teacher") {
    await Teacher.create({
      user: user._id,
      headline: "New tutor profile",
      contact: { email, phone },
      profileStatus: "draft"
    });
  } else {
    await Student.create({ user: user._id });
  }

  sendTokenResponse(user, 201, res);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.status !== "active") throw new ApiError(403, "Account is not active");

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.json({ success: true, message: "If the email exists, reset instructions were sent." });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${env.frontendUrl}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: "Reset your TeachMe password",
    text: `Open this link to reset your password: ${resetUrl}`,
    html: `<p>Open this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
  });

  const response = { success: true, message: "If the email exists, reset instructions were sent." };
  if (env.nodeEnv !== "production") response.resetToken = resetToken;
  res.json(response);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  }).select("+password");

  if (!user) throw new ApiError(400, "Reset token is invalid or expired");

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

