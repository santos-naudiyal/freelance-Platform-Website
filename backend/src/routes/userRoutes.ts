import express from 'express';
import { registerUser, getUserProfile, getCredits } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.post('/register', registerUser as any);
router.get('/profile', requireAuth, getUserProfile as any);
router.get('/credits', requireAuth, getCredits as any);

export default router;
