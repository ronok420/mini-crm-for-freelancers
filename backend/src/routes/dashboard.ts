import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { getSummary } from '../controllers/dashboardController';


const router = Router();

// Apply authentication middleware
router.use(authMiddleware);
router.get('/', getSummary);

export default router;
