import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ChatService } from '../services/chatService';

const chatService = new ChatService();

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { workspaceId, text, type } = req.body;
    const senderId = req.user?.uid;
    const senderName = req.user?.email || 'Anonymous'; // In real app, fetch from User profile

    if (!senderId || !workspaceId || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const message = await chatService.sendMessage({
      workspaceId,
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
    const workspaceId = req.params.workspaceId as string;

    if (!workspaceId) {
      return res.status(400).json({ error: 'Workspace ID is required' });
    }

    const messages = await chatService.getMessages(workspaceId);
    res.json(messages);
  } catch (error: any) {
    console.error('Get Messages Error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
