import { Router } from "express";
import { getAdminAnalytics, listUsers, updateTeacherModeration, updateUserStatus } from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();

router.use(protect, authorize("admin"));
router.get("/analytics", getAdminAnalytics);
router.get("/users", listUsers);
router.patch("/users/:id/status", updateUserStatus);
router.patch("/teachers/:id/moderation", updateTeacherModeration);

export default router;

