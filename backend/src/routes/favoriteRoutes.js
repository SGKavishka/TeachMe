import { Router } from "express";
import { listFavorites, toggleFavorite } from "../controllers/favoriteController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();

router.use(protect, authorize("student"));
router.get("/", listFavorites);
router.post("/:teacherId", toggleFavorite);

export default router;

