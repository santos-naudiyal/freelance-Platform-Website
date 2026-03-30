import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny, ZodIssue } from 'zod';
import { logger } from '../utils/logger';

/**
 * Creates a validation middleware using a Zod schema.
 * Automatically validates req.body, req.query, and req.params.
 */
export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as any;
        logger.warn({ path: req.path, issues: zodError.errors }, 'Validation Failed');
        res.status(400).json({
          error: 'Validation Error',
          details: zodError.errors.map((err: ZodIssue) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      } else {
        next(error);
      }
    }
  };
};
