import express from 'express';
import { createReport, getAllReports, updateReportStatus } from '../controllers/reportController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.post('/', protect, createReport);
router.get('/', protect, isAdmin, getAllReports);
router.patch('/:id', protect, isAdmin, updateReportStatus);

export default router;