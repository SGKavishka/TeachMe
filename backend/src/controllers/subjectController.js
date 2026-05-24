import { Subject } from "../models/Subject.js";
import { Topic } from "../models/Topic.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({ isActive: true }).sort({ category: 1, name: 1 });
  res.json({ success: true, data: subjects });
});

export const createSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.create(req.body);
  res.status(201).json({ success: true, data: subject });
});

export const listTopics = asyncHandler(async (req, res) => {
  const topics = await Topic.find({ subject: req.params.subjectId }).sort({ name: 1 });
  res.json({ success: true, data: topics });
});

export const createTopic = asyncHandler(async (req, res) => {
  const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const topic = await Topic.create({ ...req.body, subject: req.params.subjectId, slug });
  res.status(201).json({ success: true, data: topic });
});

