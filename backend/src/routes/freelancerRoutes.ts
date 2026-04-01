import { Router } from 'express';
import { updateFreelancerProfile, getFreelancerById, getAllFreelancers } from '../controllers/freelancerController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, getAllFreelancers);
router.put('/profile', requireAuth, updateFreelancerProfile);
router.get('/:id', requireAuth, getFreelancerById);

export default router;
