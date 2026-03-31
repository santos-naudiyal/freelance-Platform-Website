import express from 'express';
import { createFromAI, getWorkspaceByProjectId } from '../controllers/workspaceController';
import * as taskController from '../controllers/taskController';
import * as chatController from '../controllers/chatController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.post('/create-from-ai', requireAuth, createFromAI);

// 🔥 ADD THIS (CRITICAL)
router.get('/:projectId', requireAuth, getWorkspaceByProjectId);

// Tasks
router.get('/:projectId/tasks', requireAuth, taskController.getTasks);
router.post('/tasks', requireAuth, taskController.createTask);
router.patch('/tasks/:taskId', requireAuth, taskController.updateTaskStatus);

// Chat
router.get('/:workspaceId/messages', requireAuth, chatController.getMessages);
router.post('/messages', requireAuth, chatController.sendMessage);

export default router;