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

    const { title, bio, skills, hourlyRate, availability, githubUrl, portfolioLinks, avatar } = req.body;

    const freelancerData: any = {
      userId: uid,
      updatedAt: Date.now(),
    };

    if (title !== undefined) freelancerData.title = title;
    if (bio !== undefined) freelancerData.bio = bio;
    if (skills !== undefined) freelancerData.skills = skills;
    if (hourlyRate !== undefined) freelancerData.hourlyRate = hourlyRate;
    if (availability !== undefined) freelancerData.availability = availability;
    
    // Professional trust fields
    if (githubUrl !== undefined) freelancerData.githubUrl = githubUrl;
    if (portfolioLinks !== undefined) freelancerData.portfolioLinks = portfolioLinks;
    if (avatar !== undefined) freelancerData.avatar = avatar;

    // Use set with merge true so we don't overwrite rating if it exists
    await db.collection('Freelancers').doc(uid).set({ profile: freelancerData }, { merge: true });

    // If avatar was updated, sync it to the User document as well
    if (avatar) {
      await db.collection('Users').doc(uid).update({ avatar });
    }

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

export const getAllFreelancers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Optional query param for department filtering on the backend
    const { department } = req.query;

    let query: any = db.collection('Freelancers');
    
    // We can't easily filter by nested field profile.department in root query if it's dynamic
    // but Firestore allows equality checks on nested objects.
    if (department && department !== 'All') {
      query = query.where('profile.department', '==', department);
    }

    const snapshot = await query.get();
    const freelancers = snapshot.docs.map((doc: any) => doc.data());

    // We might also want to stitch some user data, but the freelancer doc already has name, email, avatar.
    res.status(200).json(freelancers);
  } catch (error: any) {
    console.error('Get All Freelancers Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
