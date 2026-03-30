import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role?: string;
  };
}

/**
 * Middleware to verify Firebase ID Token and attach user to request object.
 */
export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn({ url: req.url }, 'Unauthorized: No token provided');
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'client',
    };
    
    next();
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack }, 'Authentication Failure');
    res.status(403).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

/**
 * Middleware to enforce specific roles after authentication.
 */
export const checkRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      res.status(401).json({ error: 'User role not found' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      logger.warn({ uid: req.user.uid, role: req.user.role, required: roles }, 'RBAC Forbidden Access');
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }

    next();
  };
};

