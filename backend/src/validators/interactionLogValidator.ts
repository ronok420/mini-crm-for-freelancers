import { z } from 'zod';

export const interactionLogSchema = z.object({
  client_id: z.string().uuid().optional(),
  project_id: z.string().uuid().optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  type: z.enum(['call', 'email', 'meeting']),
  notes: z.string().optional(),
});
