import express from 'express';
import { createScheme, getAllSchemes,getSchemeById,updateScheme,deleteScheme,getEligibleSchemes} from '../controllers/schemeController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';


const router = express.Router();

router.post('/', protect, isAdmin, createScheme);
router.get('/', getAllSchemes);
router.patch('/:id', protect, isAdmin, updateScheme);
router.delete('/:id', protect, isAdmin, deleteScheme);
router.get("/eligible", protect, getEligibleSchemes);
router.get('/:id', getSchemeById);

export default router;