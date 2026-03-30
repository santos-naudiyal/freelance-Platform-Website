import express from 'express';
import { registerUser, getUserProfile, getCredits, updateUserProfile, uploadAvatar, uploadAvatarPublic } from '../controllers/userController';
import { requireAuth } from '../middleware/auth';
import { uploader } from '../utils/uploader';

const router = express.Router();

router.post('/register', registerUser as any);
router.get('/profile', requireAuth, getUserProfile as any);
router.put('/profile', requireAuth, updateUserProfile as any);
router.get('/credits', requireAuth, getCredits as any);
router.post('/avatar', requireAuth, uploader.single('avatar'), uploadAvatar as any);
router.post('/avatar-public', uploader.single('avatar'), uploadAvatarPublic as any);

export default router;
