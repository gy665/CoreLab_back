// routes/notification.route.js
import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getUserNotifications,
  markAsRead
} from '../controllers/notification.controller.js';

const router = express.Router();

router.get('/', getUserNotifications);
router.patch('/:id/read', markAsRead);

export default router;