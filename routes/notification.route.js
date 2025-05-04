// routes/notification.route.js
import express from 'express';
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  hasUnreadNotifications
} from '../controllers/notification.controller.js';

const router = express.Router();

// Get all notifications for a user
router.get('/:id', getUserNotifications);

// Mark a single notification as read
router.patch('/:id/read', markAsRead);

// Mark all notifications as read for a user
router.patch('/user/:userId/mark-all-read',  markAllAsRead);

// Check if user has unread notifications
router.get('/user/:userId/has-unread', hasUnreadNotifications);

export default router;