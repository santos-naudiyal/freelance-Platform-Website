import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role?: string;
  };
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  const idToken = authHeader.split('Bearer ')[1];
  console.log('Token received, length:', idToken ? idToken.length : 0);
  if (idToken) {
    console.log('Token start:', idToken.substring(0, 15));
    console.log('Token end:', idToken.slice(-15));
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'client',
    };
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(403).json({ error: 'Unauthorized: Invalid token' });
  }
};
