import { Router } from 'express';
import { sendMessage, getMessages } from '../controllers/chatController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// All chat routes are protected
router.use(requireAuth);

router.post('/send', sendMessage);
router.get('/:projectId', getMessages);

export default router;
