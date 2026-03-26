import express from 'express';
import { generatePlan, analyzeRisk, matchExperts, chatCopilot, getProjectInsights } from '../controllers/aiController';
import * as assistantController from '../controllers/AssistantController';
import { requireAuth } from '../middleware/auth';
import { requireRole } from '../middleware/validation';

const router = express.Router();

router.post('/generate-plan', requireAuth, requireRole('client'), generatePlan as any);
router.post('/generate-project', requireAuth, requireRole('client'), generatePlan as any); // Fallback for original requirement
router.post('/analyze-risk', requireAuth, analyzeRisk as any);
router.post('/match-experts', requireAuth, requireRole('client'), matchExperts as any);
router.post('/chat-copilot', requireAuth, chatCopilot as any);
router.post('/insights', requireAuth, getProjectInsights as any);

// Assistant
router.post('/assistant/summarize', requireAuth, assistantController.summarizeChat as any);
router.post('/assistant/taskify', requireAuth, assistantController.extractTasks as any);

export default router;
