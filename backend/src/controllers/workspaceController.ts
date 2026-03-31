import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { WorkspaceService } from '../services/workspaceService';
import { db } from '../config/firebase';

const workspaceService = new WorkspaceService();

/**
 * 🔥 Create workspace from AI
 */
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

    const projectId = await workspaceService.createWorkspaceFromAI(
      clientId,
      outcome,
      aiData
    );

    // 🔥 IMPORTANT: return workspaceId also
    res.status(201).json({
      message: 'Workspace created successfully',
      projectId,
      workspaceId: projectId // project = workspace
    });

  } catch (error: any) {
    console.error('Create Workspace Error:', error);
    res.status(500).json({ error: 'Failed to create workspace' });
  }
};


/**
 * 🔥 Get workspace (project) by ID
 */
export const getWorkspaceByProjectId = async (req: AuthRequest, res: Response) => {
  try {
    const projectIdParam = req.params.projectId;

    const projectId = Array.isArray(projectIdParam)
      ? projectIdParam[0]
      : projectIdParam;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    const projectDoc = await db.collection('Projects').doc(projectId).get();

    if (!projectDoc.exists) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    const project = projectDoc.data();

    res.status(200).json({
      workspaceId: project?.workspaceId || projectId,
      project
    });

  } catch (error) {
    console.error('Get Workspace Error:', error);
    res.status(500).json({ error: 'Failed to fetch workspace' });
  }
};