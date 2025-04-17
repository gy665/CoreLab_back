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