import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/', protect, isAdmin, getAnalytics);

export default router;