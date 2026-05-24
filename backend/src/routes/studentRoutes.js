import { Router } from "express";
import { getStudentDashboard, updateStudentProfile } from "../controllers/studentController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();

router.get("/dashboard", protect, authorize("student"), getStudentDashboard);
router.patch("/profile", protect, authorize("student"), updateStudentProfile);

export default router;

