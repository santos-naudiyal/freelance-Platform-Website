import { Router } from 'express';
import { updateFreelancerProfile, getFreelancerById } from '../controllers/freelancerController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.put('/profile', requireAuth, updateFreelancerProfile);
router.get('/:id', requireAuth, getFreelancerById);

export default router;
