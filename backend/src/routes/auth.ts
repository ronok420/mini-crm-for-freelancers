
import { Router, Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabaseClient';

const router = Router();

// Types for request bodies
interface AuthRequestBody {
  email: string;
  password: string;
}

// Signup Route
router.post('/signup', async (req: Request<{}, {}, AuthRequestBody>, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(200).json({
      message: 'Signup successful. Please verify your email.',
      user: data.user,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login Route
router.post('/login', async (req: Request<{}, {}, AuthRequestBody>, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      res.status(401).json({ error: error.message });
      return;
    }

    res.status(200).json({
      message: 'Login successful',
      session: data.session,
      user: data.user,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
