import { Router } from 'express';
import { submitProposal, getProjectProposals, updateProposalStatus, getUserProposals } from '../controllers/proposalController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, submitProposal);
router.get('/my', requireAuth, getUserProposals);
router.get('/project/:projectId', requireAuth, getProjectProposals);
router.patch('/:id/status', requireAuth, updateProposalStatus);

export default router;
