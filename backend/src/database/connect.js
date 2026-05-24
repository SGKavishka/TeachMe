import mongoose from "mongoose";
import { env } from "../config/env.js";

export const connectDb = async () => {
  mongoose.set("strictQuery", true);
  const connection = await mongoose.connect(env.mongoUri);
  console.log(`MongoDB connected: ${connection.connection.host}`);
};
