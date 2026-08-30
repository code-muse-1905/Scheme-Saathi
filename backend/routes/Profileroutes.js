import express from "express";
import { getMyProfile, upsertMyProfile, extractProfileFromText } from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMyProfile);
router.put("/me", protect, upsertMyProfile);
router.post("/extract", protect, extractProfileFromText);

export default router;