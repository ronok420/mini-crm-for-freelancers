import { z } from 'zod';

export const projectSchema = z.object({
  client_id: z.string().uuid(),
  title: z.string().min(1),
  budget: z.number().nonnegative(),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  status: z.enum(['planned', 'in_progress', 'completed', 'cancelled']),
});
