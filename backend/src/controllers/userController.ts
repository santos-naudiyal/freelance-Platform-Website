import { Request, Response } from 'express';
import { auth, db } from '../config/firebase';
import { AuthRequest } from '../middleware/auth';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role } = req.body;

    if (!['client', 'freelancer'].includes(role)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Set custom claim for role
    await auth.setCustomUserClaims(userRecord.uid, { role });

    // Create user document in Firestore
    await db.collection('Users').doc(userRecord.uid).set({
      id: userRecord.uid,
      name,
      email,
      role,
      aiCredits: 10, // Proactive initialization
      createdAt: Date.now(),
    });

    res.status(201).json({ message: 'User registered successfully', uid: userRecord.uid });
  } catch (error: any) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const getCredits = async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });

    const userDoc = await db.collection('Users').doc(uid as string).get();
    res.json({ credits: userDoc.data()?.aiCredits || 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const userDoc = await db.collection('Users').doc(uid as string).get();
    if (!userDoc.exists) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    let profileData = userDoc.data();

    // If freelancer, fetch additional profile
    if (profileData?.role === 'freelancer') {
      const freelancerDoc = await db.collection('Freelancers').doc(uid).get();
      if (freelancerDoc.exists) {
        profileData = { ...profileData, freelancerDetails: freelancerDoc.data() };
      }
    }

    res.status(200).json(profileData);
  } catch (error: any) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
