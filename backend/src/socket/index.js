import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { Message } from "../models/Message.js";
import { getConversationId } from "../controllers/messageController.js";
import { attachSocketServer, notifyUser } from "../services/notificationService.js";

export const initSocket = (httpServer, app) => {
  const io = new Server(httpServer, {
    cors: {
      origin: env.frontendUrl,
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));

      const decoded = jwt.verify(token, env.jwtSecret);
      const user = await User.findById(decoded.id);
      if (!user || user.status !== "active") return next(new Error("Invalid user"));

      socket.user = user;
      next();
    } catch (error) {
      next(error);
    }
  });

  io.on("connection", (socket) => {
    socket.join(String(socket.user._id));

    socket.on("message:send", async ({ receiver, body, booking }, callback) => {
      try {
        const receiverUser = await User.findById(receiver);
        if (!receiverUser) throw new Error("Receiver not found");

        const message = await Message.create({
          conversationId: getConversationId(socket.user._id, receiver),
          sender: socket.user._id,
          receiver,
          booking,
          body
        });

        io.to(String(receiver)).emit("message:new", message);
        await notifyUser({
          user: receiver,
          type: "message",
          title: "New message",
          body: `${socket.user.name} sent you a message.`,
          metadata: { senderId: String(socket.user._id) }
        });

        callback?.({ success: true, message });
      } catch (error) {
        callback?.({ success: false, message: error.message });
      }
    });
  });

  app.set("io", io);
  attachSocketServer(io);
  return io;
};

