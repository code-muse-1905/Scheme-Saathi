import express from 'express';
import {
  createApplication,
  getMyApplications,
  updateApplication,
  deleteApplication,
} from '../controllers/applicationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createApplication);
router.get('/me', protect, getMyApplications);
router.patch('/:id', protect, updateApplication);
router.delete('/:id', protect, deleteApplication);

export default router;