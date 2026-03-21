import { Response } from 'express';
import { db } from '../config/firebase';
import { AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid || req.user?.role !== 'client') {
      res.status(403).json({ error: 'Only clients can post projects' });
      return;
    }

    const { title, description, budget, deadline, skillsRequired } = req.body;

    const projectId = uuidv4();
    const projectData = {
      id: projectId,
      clientId: uid,
      title,
      description,
      budget,
      deadline: deadline || null,
      skillsRequired: skillsRequired || [],
      status: 'open',
      createdAt: Date.now(),
    };

    await db.collection('Projects').doc(projectId).set(projectData);

    res.status(201).json({ message: 'Project created successfully', data: projectData });
  } catch (error: any) {
    console.error('Create Project Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const snapshot = await db.collection('Projects').where('status', '==', 'open').get();
    const projects = snapshot.docs.map((doc: any) => doc.data());
    res.status(200).json(projects);
  } catch (error: any) {
    console.error('Get All Projects Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.id as string;
    const projectDoc = await db.collection('Projects').doc(projectId).get();
    
    if (!projectDoc.exists) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.status(200).json(projectDoc.data());
  } catch (error: any) {
    console.error('Get Project By ID Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProjectStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    const projectId = req.params.id as string;
    const { status } = req.body;

    if (!uid || req.user?.role !== 'client') {
      res.status(403).json({ error: 'Only clients can update projects' });
      return;
    }

    const projectRef = db.collection('Projects').doc(projectId);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    if (projectDoc.data()?.clientId !== uid) {
      res.status(403).json({ error: 'You are not the owner of this project' });
      return;
    }

    await projectRef.update({ status });
    res.status(200).json({ message: 'Project status updated successfully', status });
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

    const snapshot = await db.collection('Projects').where('clientId', '==', uid).get();
    const projects = snapshot.docs.map((doc: any) => doc.data());
    res.status(200).json(projects);
  } catch (error: any) {
    console.error('Get User Projects Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
