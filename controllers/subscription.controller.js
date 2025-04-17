import Subscription from '../models/subscription.model.js';
import User from '../models/user.model.js';
import subscriptionPlans from '../config/subscriptionPlans.js';
import mongoose from 'mongoose';

// Create subscription
export const createSubscription = async (req, res) => {
    try {
      const  planType  = req.body.planType;
      const user_id = req.body.user; // Now contains full user document
  
      const user = await User.findById(user_id)

      
      if (!user) {
        return res.status(404).json({ message: "User not found" });

      }
  
      const plan = subscriptionPlans[planType];

    

      if (!plan) {
        return res.status(400).json({ message: 'Invalid subscription plan' });
      }
  
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.durationDays);

      const price = plan.price

  

  
      const subscription = await Subscription.create({
        user, // Use the attached user's ID
        planType,
        endDate,
        price
      });
  
      // Update user's subscription references
      user.subscriptions.push(subscription._id);
      user.activeSubscription = subscription._id;
      await user.save();
  
      res.status(201).json(subscription);
      
    } catch (error) {
      console.error("Subscription error:", error);
      res.status(500).json({ 
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      });
    }
  };

// Get user subscriptions
export const getUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.body.user });
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSub = async (req, res) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    res.status(200).json(sub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
    try {
      // Use req.params.id consistently (no undefined subscriptionId)
      const subscription = await Subscription.findOneAndUpdate(
        {
          _id: req.params.id,  // Use the ID from URL params
        
        },
        { 
          isActive: false,
          cancelledAt: new Date() 
        },
        { new: true }  // Return updated document
      );
  
      if (!subscription) {
        return res.status(404).json({
          message: 'Subscription not found or access denied',
          code: 'SUBSCRIPTION_NOT_FOUND'
        });
      }
  
      // Update user's active subscription if needed
      if (subscription.user.activeSubscription?.equals(req.params.id)) {
        await User.findByIdAndUpdate(subscription.user._id, {
          $set: { activeSubscription: null }
        });
      }
  
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