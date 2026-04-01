import { Request, Response } from 'express';
import { auth, db, storage } from '../config/firebase';
import { AuthRequest } from '../middleware/auth';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Registration Payload Received:', JSON.stringify(req.body, null, 2));
    const { 
      email, password, name, role,
      companyName, address, industry, website,
      title, bio, department, skills, githubUrl, portfolioLinks, avatar
    } = req.body;

    if (!['client', 'freelancer'].includes(role)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      photoURL: avatar || undefined
    });

    // Set custom claim for role
    await auth.setCustomUserClaims(userRecord.uid, { role });

    // Create user document in Firestore (Base details)
    const userData: any = {
      id: userRecord.uid,
      name,
      email,
      role,
      avatar: avatar || null,
      aiCredits: 10,
      createdAt: Date.now(),
    };

    // Add Client-specific details if applicable
    if (role === 'client') {
      userData.companyName = companyName || null;
      userData.address = address || null;
      userData.industry = industry || null;
      userData.website = website || null;
    }

    await db.collection('Users').doc(userRecord.uid).set(userData);

    // If freelancer, also create specialized profile record
    if (role === 'freelancer') {
      await db.collection('Freelancers').doc(userRecord.uid).set({
        id: userRecord.uid,
        name,
        email,
        profile: {
          title: title || 'Professional Freelancer',
          bio: bio || '',
          department: department || 'Other',
          skills: skills || [],
          hourlyRate: 0, // Default to 0, to be updated by freelancer
          avatar: avatar || null,
          githubUrl: githubUrl || null,
          portfolioLinks: portfolioLinks || []
        },
        availability: 'available',
        createdAt: Date.now()
      });
    }

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

export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { name, companyName, address, industry, website, avatar } = req.body;

    const updateData: any = {
      updatedAt: Date.now()
    };
    if (name) updateData.name = name;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (address !== undefined) updateData.address = address;
    if (industry !== undefined) updateData.industry = industry;
    if (website !== undefined) updateData.website = website;
    if (avatar !== undefined) updateData.avatar = avatar;

    await db.collection('Users').doc(uid as string).update(updateData);

    // Sync with Firebase Auth
    if (name || avatar) {
      await auth.updateUser(uid, {
        displayName: name || undefined,
        photoURL: avatar || undefined
      });
    }

    res.status(200).json({ message: 'Profile updated successfully', data: updateData });
  } catch (error: any) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadAvatar = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    const file = req.file;

    if (!uid || !file) {
      res.status(400).json({ error: 'Invalid request' });
      return;
    }

    const bucket = storage.bucket();
    const fileName = `avatars/${uid}_${Date.now()}_${file.originalname}`;
    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (err: Error) => {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Upload failed' });
    });

    blobStream.on('finish', async () => {
      // Make the file public so we can get a direct URL
      await blob.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      
      res.status(200).json({ url: publicUrl });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error('Upload Avatar Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadAvatarPublic = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    const bucket = storage.bucket();
    const fileName = `temp_avatars/${Date.now()}_${file.originalname}`;
    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on('error', (err: Error) => {
      console.error('Public Upload error:', err);
      res.status(500).json({ error: 'Upload failed' });
    });

    blobStream.on('finish', async () => {
      await blob.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      res.status(200).json({ url: publicUrl });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error('Upload Avatar Public Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
