// controllers/notification.controller.js
import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';

export const getUserNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const notifications = await Notification.find({
      user: user._id
    }).sort({ createdAt: -1 });
    
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id},
      { read: true },
      { new: true }
    );
    
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const result = await Notification.updateMany(
      { user: user._id, read: false },
      { $set: { read: true } }
    );

    if (result.modifiedCount === 0) {
      return res.status(200).json({ message: 'No unread notifications to mark' });
    }

    res.status(200).json({ 
      message: `Marked ${result.modifiedCount} notifications as read`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const hasUnreadNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const count = await Notification.countDocuments({
      user: user._id,
      read: false
    });

    res.status(200).json({ hasUnread: count > 0, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};