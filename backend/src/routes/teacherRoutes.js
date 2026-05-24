import { Router } from "express";
import { getMyTeacherProfile, getTeacherById, listTeachers, updateMyTeacherProfile } from "../controllers/teacherController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();

router.get("/", listTeachers);
router.get("/me", protect, authorize("teacher"), getMyTeacherProfile);
router.patch("/me", protect, authorize("teacher"), updateMyTeacherProfile);
router.get("/:id", getTeacherById);

export default router;

