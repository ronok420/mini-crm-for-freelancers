  
import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  company: z.string().optional(),
  notes: z.string().optional(),
});
