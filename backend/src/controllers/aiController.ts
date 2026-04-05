import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AIOrchestrator } from '../services/ai/aiOrchestrator';
import { db } from '../config/firebase';
import { logger } from '../utils/logger';


import { MatchingService } from '../services/matchingService';

const aiService = new AIOrchestrator();
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
    logger.error({ error: error.message, stack: error.stack }, 'AI Plan Error');
    res.status(500).json({ error: `Backend AI Error: ${error.message || 'Unknown error'}` });
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
    logger.error('AI Risk Error:', error);
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
    logger.error('AI Match Error:', error);
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
    logger.error('AI Insights Error:', error);
    res.status(500).json({ error: `Backend AI Error: ${error.message}` });
  }
};

export const draftProposal = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.body;
    const userId = req.user?.uid;
    
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!projectId) return res.status(400).json({ error: 'Project ID is required' });

    // 1. Fetch Project Details
    const projectDoc = await db.collection('Projects').doc(projectId).get();
    if (!projectDoc.exists) return res.status(404).json({ error: 'Project not found' });
    const projectContext = { id: projectDoc.id, ...projectDoc.data() };

    // 2. Fetch Freelancer details
    const freelancerDoc = await db.collection('Freelancers').doc(userId).get();
    if (!freelancerDoc.exists) {
        return res.status(400).json({ error: 'Freelancer profile missing. Complete profile first.' });
    }
    const freelancerProfile = { userId, ...freelancerDoc.data() };

    // 3. Draft via Orchestrator
    const draft = await aiService.draftProposal(projectContext, freelancerProfile);
    
    res.json(draft);
  } catch (error: any) {
    logger.error('Proposal Drafting Error:', error);
    res.status(500).json({ error: `Backend AI Error: ${error.message}` });
  }
};

export const estimatePricing = async (req: AuthRequest, res: Response) => {
  try {
    const { outcome } = req.body;
    
    if (!outcome) {
      return res.status(400).json({ error: 'Project outcome/scope is required for pricing estimation' });
    }

    const pricing = await aiService.estimatePricing(outcome);
    res.json(pricing);
  } catch (error: any) {
    logger.error('Pricing Estimation Error:', error);
    res.status(500).json({ error: `Backend AI Error: ${error.message}` });
  }
};

export const generateQuotation = async (req: AuthRequest, res: Response) => {
  try {
    const { outcome, targetBudget } = req.body;
    if (!outcome) {
      return res.status(400).json({ error: 'Outcome is required' });
    }

    const quotation = await aiService.generateProjectQuotation(outcome, targetBudget);
    res.json(quotation);
  } catch (error: any) {
    logger.error('Quotation Generation Error:', error);
    res.status(500).json({ error: `Backend AI Error: ${error.message}` });
  }
};

