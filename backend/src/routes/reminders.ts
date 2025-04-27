import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import * as controller from '../controllers/reminderController';

const router = Router();
// Apply authentication middleware
router.use(authMiddleware);
router.get('/', controller.list);
router.get('/this-week', controller.listThisWeek);
router.get('/:id', controller.getOne);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
