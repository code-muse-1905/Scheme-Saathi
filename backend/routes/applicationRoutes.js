import express from 'express';
import { checkAndSendReminders } from '../cron/reminderCron.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';
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
router.post('/trigger-reminders', protect, isAdmin, async (req, res) => {
  try {
    const count = await checkAndSendReminders();
    res.status(200).json({ message: `Sent ${count} reminder(s).` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;