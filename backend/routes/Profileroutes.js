import express from "express";
import { getMyProfile, upsertMyProfile } from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/me", protect, upsertMyProfile);

export default router;