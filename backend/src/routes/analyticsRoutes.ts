import express from 'express';
import { getPlatformStats, getFreelancerStats } from '../controllers/AnalyticsController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.get('/stats', requireAuth, getPlatformStats as any);
router.get('/freelancer', requireAuth, getFreelancerStats as any);

export default router;
