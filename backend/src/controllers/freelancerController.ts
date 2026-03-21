import { Response } from 'express';
import { db } from '../config/firebase';
import { AuthRequest } from '../middleware/auth';

export const updateFreelancerProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Must be a freelancer to update this
    if (req.user?.role !== 'freelancer') {
      res.status(403).json({ error: 'Only freelancers can update this profile' });
      return;
    }

    const { title, bio, skills, hourlyRate, availability } = req.body;

    const freelancerData = {
      userId: uid,
      title,
      bio,
      skills,
      hourlyRate,
      availability,
      updatedAt: Date.now(),
    };

    // Use set with merge true so we don't overwrite rating if it exists
    await db.collection('Freelancers').doc(uid).set(freelancerData, { merge: true });

    res.status(200).json({ message: 'Freelancer profile updated successfully', data: freelancerData });
  } catch (error: any) {
    console.error('Update Freelancer Profile Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFreelancerById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userDoc = await db.collection('Users').doc(id).get();
    
    if (!userDoc.exists || userDoc.data()?.role !== 'freelancer') {
      res.status(404).json({ error: 'Freelancer not found' });
      return;
    }

    const freelancerDoc = await db.collection('Freelancers').doc(id).get();
    
    res.status(200).json({
      ...userDoc.data(),
      freelancerDetails: freelancerDoc.data() || null,
    });
  } catch (error: any) {
    console.error('Get Freelancer Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
