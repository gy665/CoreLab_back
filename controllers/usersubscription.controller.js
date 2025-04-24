import User from '../models/user.model.js';
import UserSubscription from '../models/usersubscription.model.js';
import SubscriptionPlan from '../models/subscriptionplan.model.js';
import mongoose from 'mongoose';

// Create user subscription
export const createSubscription = async (req, res) => {
  try {
    const { user: userId, planType } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const plan = await SubscriptionPlan.findOne({ planType });
    if (!plan) return res.status(400).json({ message: 'Invalid subscription plan' });

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + plan.durationDays);

    const userSubscription = new UserSubscription({
      user: userId,
      subscriptionPlan: plan._id,
      startDate,
      endDate,
      isActive: true
    });

    await userSubscription.save();

    // Optional: update user if you're tracking activeSubscription
    user.activeSubscription = userSubscription._id;
    await user.save();

    res.status(201).json(userSubscription);

  } catch (error) {
    console.error("Subscription error:", error);
    res.status(500).json({ 
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

// Get all subscriptions for a user
export const getUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await UserSubscription.find({ user: req.params.id })
      .populate('subscriptionPlan')
      .sort({ startDate: -1 });

    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single subscription by ID
export const getSub = async (req, res) => {
  try {
    const sub = await UserSubscription.findById(req.params.id)
      .populate('subscriptionPlan')
      .populate('user');

    if (!sub) return res.status(404).json({ message: "Subscription not found" });
    res.status(200).json(sub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel a subscription
export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await UserSubscription.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({
        message: 'Subscription not found',
        code: 'SUBSCRIPTION_NOT_FOUND'
      });
    }

    // Optionally update user's activeSubscription field
    await User.findByIdAndUpdate(subscription.user, {
      $set: { activeSubscription: null }
    });

    res.status(200).json({
      message: 'Subscription cancelled successfully',
      data: subscription
    });

  } catch (error) {
    console.error('Cancellation error:', error);
    res.status(500).json({
      message: 'Failed to cancel subscription',
      code: 'CANCELLATION_FAILED'
    });
  }
};
