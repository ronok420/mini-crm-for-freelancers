import { z } from 'zod';

export const reminderSchema = z.object({
  note: z.string().min(1),
  due_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  client_id: z.string().uuid().optional(),
  project_id: z.string().uuid().optional(),
});
