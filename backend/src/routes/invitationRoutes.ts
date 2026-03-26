import express from 'express';
import { sendInvite, respondToInvite } from '../controllers/InvitationController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.post('/send', requireAuth, sendInvite as any);
router.post('/respond', requireAuth, respondToInvite as any);

export default router;
