import { Router } from 'express';
import { registerUser, getUserProfile } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/register', registerUser);
router.get('/profile', requireAuth, getUserProfile);

export default router;
