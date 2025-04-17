import express from 'express';
import { 
  createSubscription,
  cancelSubscription,
  getUserSubscriptions,
  getSub
} from '../controllers/subscription.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', createSubscription);
router.get('/', getUserSubscriptions);
router.get('/:id', getSub);
router.patch('/:id/cancel', cancelSubscription);

export default router;