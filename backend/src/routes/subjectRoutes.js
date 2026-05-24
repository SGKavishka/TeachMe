import { Router } from "express";
import { createSubject, createTopic, listSubjects, listTopics } from "../controllers/subjectController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();

router.get("/", listSubjects);
router.get("/:subjectId/topics", listTopics);
router.post("/", protect, authorize("admin"), createSubject);
router.post("/:subjectId/topics", protect, authorize("admin"), createTopic);

export default router;

