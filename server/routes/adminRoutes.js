import express from 'express';
import { getAdminStats, resetSeedData } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin only routes
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.post('/reset-seed', resetSeedData);

export default router;
