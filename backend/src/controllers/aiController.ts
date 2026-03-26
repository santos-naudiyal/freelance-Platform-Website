import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AIService } from '../services/aiService';
import { db } from '../config/firebase';


import { MatchingService } from '../services/matchingService';

const aiService = new AIService();
const matchingService = new MatchingService();

export const generatePlan = async (req: AuthRequest, res: Response) => {
  try {
    const { outcome } = req.body;
    const userId = req.user?.uid;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    if (!outcome) {
      return res.status(400).json({ error: 'Project outcome is required' });
    }

    const result = await aiService.generateProjectPlan(outcome);
    res.json(result);
  } catch (error: any) {
    console.error('AI Plan Error:', error);
    res.status(500).json({ error: `Backend AI Error: ${error.message || 'Unknown error'} | Stack: ${error.stack}` });
  }
};

export const analyzeRisk = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.body;
    let projectDetails = req.body;

    if (projectId) {
      // Fetch project details for deep analysis
      const tasks = await db.collection('Tasks').where('projectId', '==', projectId).get();
      const milestones = await db.collection('Milestones').where('projectId', '==', projectId).get();
      
      projectDetails = {
        ...projectDetails,
        tasks: tasks.docs.map(doc => doc.data()),
        milestones: milestones.docs.map(doc => doc.data()),
      };
    }

    const analysis = await aiService.analyzeRisk(projectDetails);
    res.json(analysis);
  } catch (error: any) {
    console.error('AI Risk Error:', error);
    res.status(500).json({ error: `Backend AI Error: ${error.message}` });
  }
};

export const matchExperts = async (req: AuthRequest, res: Response) => {
  try {
    const { outcome } = req.body;
    if (!outcome) {
      return res.status(400).json({ error: 'Outcome is required' });
    }

    const matches = await matchingService.matchFreelancers(outcome);
    res.json({ experts: matches });
  } catch (error: any) {
    console.error('AI Match Error:', error);
    res.status(500).json({ error: `Backend AI Error: ${error.message}` });
  }
};

export const chatCopilot = async (req: AuthRequest, res: Response) => {
  try {
    const { message, context } = req.body;
    const reply = await aiService.chatCopilot(message, context);
    res.json({ reply });
  } catch (error: any) {
    res.status(500).json({ error: `Backend AI Error: ${error.message}` });
  }
};

export const getProjectInsights = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.body;
    if (!projectId) return res.status(400).json({ error: 'Project ID is required' });

    // Fetch snapshot of project state
    const [tasks, milestones, activity, chat] = await Promise.all([
      db.collection('Tasks').where('projectId', '==', projectId).get(),
      db.collection('Milestones').where('projectId', '==', projectId).get(),
      db.collection('ActivityLogs').where('projectId', '==', projectId).get(),
      db.collection('Messages').where('workspaceId', '==', projectId).get()
    ]);

    const projectContext = {
      tasks: tasks.docs.map(doc => doc.data()),
      milestones: milestones.docs.map(doc => doc.data()),
      activity: activity.docs.map(doc => doc.data()).sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0)).slice(0, 10),
      chat: chat.docs.map(doc => doc.data()).sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 15)
    };

    const insights = await aiService.getAIProjectManagerInsights(projectContext);
    res.json(insights);
  } catch (error: any) {
    console.error('AI Insights Error:', error);
    res.status(500).json({ error: `Backend AI Error: ${error.message}` });
  }
};


