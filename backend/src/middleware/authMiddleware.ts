

// authMiddleware.ts
import { RequestHandler } from 'express';
import { supabase } from '../lib/supabaseClient';

export const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Missing token' });
      return; 
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ message: 'Invalid token' });
      return; 
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('AuthMiddleware Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
