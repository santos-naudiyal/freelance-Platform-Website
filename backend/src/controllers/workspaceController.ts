import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { WorkspaceService } from '../services/workspaceService';

const workspaceService = new WorkspaceService();

export const createFromAI = async (req: AuthRequest, res: Response) => {
  try {
    const { outcome, aiData } = req.body;
    const clientId = req.user?.uid;

    if (!clientId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!outcome || !aiData) {
      return res.status(400).json({ error: 'Outcome and AI Data are required' });
    }

    const projectId = await workspaceService.createWorkspaceFromAI(clientId, outcome, aiData);
    res.status(201).json({ message: 'Workspace created successfully', projectId });
  } catch (error: any) {
    console.error('Create Workspace Error:', error);
    res.status(500).json({ error: 'Failed to create workspace' });
  }
};
