import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AIService } from '../services/aiService';
import { ChatService } from '../services/chatService';

const aiService = new AIService();
const chatService = new ChatService();

export const summarizeChat = async (req: AuthRequest, res: Response) => {
  try {
    const { workspaceId } = req.body;
    const userId = req.user?.uid;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const messages = await chatService.getMessages(workspaceId);
    
    if (messages.length === 0) {
      return res.json({ summary: 'No messages to summarize yet.' });
    }

    const hasCredits = await aiService.checkAndDeductCredits(userId, 1);
    if (!hasCredits) {
      return res.status(402).json({ error: 'Insufficient credits' });
    }

    const summary = await aiService.summarizeWorkspaceChat(messages);
    res.json({ summary });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed' });
  }
};

export const extractTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { workspaceId } = req.body;
    const userId = req.user?.uid;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const messages = await chatService.getMessages(workspaceId);
    
    const hasCredits = await aiService.checkAndDeductCredits(userId, 1);
    if (!hasCredits) {
      return res.status(402).json({ error: 'Insufficient credits' });
    }

    const tasks = await aiService.extractTasksFromChat(messages);
    res.json({ tasks });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed' });
  }
};
