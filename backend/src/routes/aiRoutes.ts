import express from 'express';
import { generatePlan, analyzeRisk, matchExperts, chatCopilot } from '../controllers/aiController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.post('/plan', requireAuth, generatePlan as any);
router.post('/risk', requireAuth, analyzeRisk as any);
router.post('/match', requireAuth, matchExperts as any);
router.post('/chat', requireAuth, chatCopilot as any);

export default router;
