import express from 'express';
import { createScheme } from '../controllers/schemeController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.post('/', protect, isAdmin, createScheme);

export default router;