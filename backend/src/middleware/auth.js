import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getTokenFromRequest = (req) => {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.split(" ")[1];
  return req.cookies?.token;
};

export const protect = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);
  if (!token) throw new ApiError(401, "Authentication required");

  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(decoded.id).select("+passwordChangedAt");

  if (!user) throw new ApiError(401, "User no longer exists");
  if (user.status !== "active") throw new ApiError(403, "Account is not active");

  req.user = user;
  next();
});

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, "You do not have permission to access this resource"));
  }
  next();
};

