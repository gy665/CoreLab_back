// models/SubscriptionPlan.js
import mongoose from 'mongoose';

const subscriptionPlanSchema = new mongoose.Schema({
  planType: {
    type: String,
    enum: ['monthly', 'quarterly','semi-annual' ,'annual'],
    unique: true,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  durationDays: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
