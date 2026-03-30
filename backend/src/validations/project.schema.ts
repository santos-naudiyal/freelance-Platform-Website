import { z } from 'zod';

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters long').max(100),
    description: z.string().min(20, 'Description must be detailed enough (20+ chars)'),
    budget: z.object({
      min: z.number().positive('Budget minimum must be positive'),
      max: z.number().positive('Budget maximum must be positive'),
      type: z.enum(['fixed', 'hourly'])
    }).refine(data => data.max >= data.min, {
      message: 'Maximum budget must be greater than or equal to minimum budget',
      path: ['max']
    }),
    skillsRequired: z.array(z.string()).min(1, 'At least one skill is required'),
  })
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(100).optional(),
    description: z.string().min(20).optional(),
    status: z.enum(['open', 'in_progress', 'completed', 'cancelled']).optional(),
  })
});
