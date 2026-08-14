import express from 'express';
import { createScheme, getAllSchemes,getSchemeById,updateScheme,deleteScheme} from '../controllers/schemeController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';


const router = express.Router();

router.post('/', protect, isAdmin, createScheme);
router.get('/', getAllSchemes);
router.get('/:id', getSchemeById);
router.patch('/:id', protect, isAdmin, updateScheme);
router.delete('/:id', protect, isAdmin, deleteScheme);

export default router;