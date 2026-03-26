import { Request, Response, NextFunction } from 'express';

export const validate = (schema: any) => (req: Request, res: Response, next: NextFunction) => {
  // Simplistic validation logic for demo, in production use Joi/Zod
  const errors: string[] = [];
  Object.keys(schema).forEach(key => {
    if (!req.body[key]) {
      errors.push(`${key} is required`);
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

export const requireRole = (role: 'client' | 'freelancer') => (req: any, res: Response, next: NextFunction) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ error: `Forbidden: Requires ${role} role` });
  }
  next();
};
