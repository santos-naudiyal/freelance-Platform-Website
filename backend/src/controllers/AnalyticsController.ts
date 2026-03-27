import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AnalyticsService } from '../services/AnalyticsService';

const analyticsService = new AnalyticsService();

export const getPlatformStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await analyticsService.getGlobalStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch platform stats' });
  }
};

export const getFreelancerStats = async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });

    const stats = await analyticsService.getFreelancerStats(uid);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch freelancer stats' });
  }
};
