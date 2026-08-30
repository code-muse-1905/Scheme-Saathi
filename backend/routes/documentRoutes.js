import express from 'express';
import {
  uploadDocument,
  getMyDocuments,
  deleteDocument,
} from '../controllers/documentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.post('/', protect, upload.single('document'), uploadDocument);
router.get('/me', protect, getMyDocuments);
router.delete('/:id', protect, deleteDocument);

export default router;