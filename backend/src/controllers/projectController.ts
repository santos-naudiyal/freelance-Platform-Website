import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ProjectService } from '../services/projectService';

const projectService = new ProjectService();

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;

    if (!uid || req.user?.role !== 'client') {
      res.status(403).json({ error: 'Only clients can post projects' });
      return;
    }

    const project = await projectService.createProject({
      ...req.body,
      clientId: uid
    });

    res.status(201).json({
      message: 'Project created successfully',
      data: project
    });

  } catch (error: any) {
    console.error('Create Project Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await projectService.getAllActiveProjects();
    res.status(200).json(projects);
  } catch (error: any) {
    console.error('Get All Projects Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await projectService.getProjectById(req.params.id as string);

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.status(200).json(project);

  } catch (error: any) {
    console.error('Get Project By ID Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProjectStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    const { status } = req.body;

    const project = await projectService.getProjectById(req.params.id as string);

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    if (project.clientId !== uid) {
      res.status(403).json({ error: 'You are not the owner of this project' });
      return;
    }

    await projectService.updateStatus(req.params.id as string, status);

    res.status(200).json({
      message: 'Project status updated successfully',
      status
    });

  } catch (error: any) {
    console.error('Update Project Status Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;

    if (!uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const projects = await projectService.getUserProjects(uid);

    res.status(200).json(projects);

  } catch (error: any) {
    console.error('Get User Projects Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};