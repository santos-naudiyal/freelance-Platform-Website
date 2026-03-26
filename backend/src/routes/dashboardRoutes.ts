import { Router } from 'express';
import { getClientDashboardSummary, getFreelancerDashboardSummary } from '../controllers/dashboardController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/client', requireAuth, getClientDashboardSummary);
router.get('/freelancer', requireAuth, getFreelancerDashboardSummary);

export default router;
