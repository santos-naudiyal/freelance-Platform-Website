import { Router } from 'express';
import { submitProposal, getProjectProposals, updateProposalStatus, getUserProposals, getClientProposals, getProposalById } from '../controllers/proposalController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, submitProposal);
router.get('/my', requireAuth, getUserProposals);
router.get('/client', requireAuth, getClientProposals);
router.get('/project/:projectId', requireAuth, getProjectProposals);
router.get('/:id', requireAuth, getProposalById);
router.patch('/:id/status', requireAuth, updateProposalStatus);

export default router;
