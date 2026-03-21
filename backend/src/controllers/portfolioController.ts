import { Response } from 'express';
import { db } from '../config/firebase';
import { AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

export const addPortfolioItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid || req.user?.role !== 'freelancer') {
      res.status(403).json({ error: 'Only freelancers can add portfolio items' });
      return;
    }

    const { title, description, images, technologies, projectLink } = req.body;

    const portfolioId = uuidv4();
    const portfolioItem = {
      id: portfolioId,
      freelancerId: uid,
      title,
      description,
      images: images || [],
      technologies: technologies || [],
      projectLink: projectLink || '',
      createdAt: Date.now(),
    };

    await db.collection('Portfolios').doc(portfolioId).set(portfolioItem);

    res.status(201).json({ message: 'Portfolio item added', data: portfolioItem });
  } catch (error: any) {
    console.error('Add Portfolio Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFreelancerPortfolio = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const freelancerId = req.params.freelancerId as string;
    
    // Check if freelancer exists
    const userDoc = await db.collection('Users').doc(freelancerId).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'freelancer') {
      res.status(404).json({ error: 'Freelancer not found' });
      return;
    }

    const snapshot = await db.collection('Portfolios').where('freelancerId', '==', freelancerId).get();
    
    const portfolios = snapshot.docs.map((doc: any) => doc.data());

    res.status(200).json(portfolios);
  } catch (error: any) {
    console.error('Get Portfolio Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
