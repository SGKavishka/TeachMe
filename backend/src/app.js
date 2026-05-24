import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(compression());
  app.use(cors({ origin: env.frontendUrl, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

  app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "TeachMe API is running" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/teachers", teacherRoutes);
  app.use("/api/students", studentRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/messages", messageRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/favorites", favoriteRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/subjects", subjectRoutes);
  app.use("/api/admin", adminRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

