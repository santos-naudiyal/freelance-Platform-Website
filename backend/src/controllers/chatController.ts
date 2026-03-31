import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ChatService } from '../services/chatService';

const chatService = new ChatService();

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, text, type } = req.body;
    const senderId = req.user?.uid;
    const senderName = req.user?.email || 'User'; 

    if (!senderId || !projectId || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const message = await chatService.sendMessage({
      projectId,
      senderId,
      senderName,
      text,
      type: type || 'user'
    });

    res.status(201).json(message);
  } catch (error: any) {
    console.error('Send Message Error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.projectId as string;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    const messages = await chatService.getMessages(projectId);
    res.json(messages);
  } catch (error: any) {
    console.error('Get Messages Error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
