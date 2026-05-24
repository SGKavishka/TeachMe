import { Notification } from "../models/Notification.js";

let ioInstance;

export const attachSocketServer = (io) => {
  ioInstance = io;
};

export const notifyUser = async ({ user, type = "system", title, body, metadata = {} }) => {
  const notification = await Notification.create({ user, type, title, body, metadata });

  if (ioInstance) {
    ioInstance.to(String(user)).emit("notification:new", notification);
  }

  return notification;
};

