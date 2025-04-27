import { RequestHandler, Request, Response } from 'express';
import * as service from '../services/dashboardService';
import { User } from '@supabase/supabase-js';

// Custom Request type for authenticated routes
interface AuthRequest extends Request {
  user: User; // Non-optional user
}

export const getSummary: RequestHandler = async (req, res) => {
  const { user } = req as AuthRequest;

  try {
    const summary = await service.getDashboardSummary(user.id);
    res.status(200).json(summary);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to load dashboard' });
  }
};
