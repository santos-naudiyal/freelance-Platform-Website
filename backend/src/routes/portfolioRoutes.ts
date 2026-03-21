import { Router } from 'express';
import { addPortfolioItem, getFreelancerPortfolio } from '../controllers/portfolioController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, addPortfolioItem);
router.get('/:freelancerId', requireAuth, getFreelancerPortfolio);

export default router;
