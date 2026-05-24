import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { notifyUser } from "../services/notificationService.js";

export const getConversationId = (firstUserId, secondUserId) => {
  return [String(firstUserId), String(secondUserId)].sort().join(":");
};

export const listConversation = asyncHandler(async (req, res) => {
  const otherUser = await User.findById(req.params.userId);
  if (!otherUser) throw new ApiError(404, "User not found");

  const conversationId = getConversationId(req.user._id, otherUser._id);
  const messages = await Message.find({ conversationId })
    .populate("sender", "name avatar role")
    .populate("receiver", "name avatar role")
    .sort({ createdAt: 1 });

  res.json({ success: true, data: messages });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const receiver = await User.findById(req.body.receiver);
  if (!receiver) throw new ApiError(404, "Receiver not found");

  const message = await Message.create({
    conversationId: getConversationId(req.user._id, receiver._id),
    sender: req.user._id,
    receiver: receiver._id,
    booking: req.body.booking,
    body: req.body.body
  });

  await notifyUser({
    user: receiver._id,
    type: "message",
    title: "New message",
    body: `${req.user.name} sent you a message.`,
    metadata: { senderId: String(req.user._id) }
  });

  req.app.get("io")?.to(String(receiver._id)).emit("message:new", message);
  res.status(201).json({ success: true, data: message });
});

