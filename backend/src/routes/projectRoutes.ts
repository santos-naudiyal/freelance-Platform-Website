import { Router } from 'express';
import { createProject, getAllProjects, getProjectById, updateProjectStatus, getUserProjects } from '../controllers/projectController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, createProject);
router.get('/', getAllProjects);
router.get('/my', requireAuth, getUserProjects);
router.get('/:id', getProjectById);
router.patch('/:id/status', requireAuth, updateProjectStatus);

export default router;
