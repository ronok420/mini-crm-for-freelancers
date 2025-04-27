

import { User } from '@supabase/supabase-js';

declare global {
  namespace Express {
    interface Request {
      user?: User; // user is optional, but will be available after auth
    }
  }
}

export {};
