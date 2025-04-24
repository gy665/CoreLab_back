// controllers/subscriptionPlan.controller.js
import SubscriptionPlan from '../models/subscriptionplan.model.js';

// Get all subscription plans
export const getAllPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plans', error });
  }
};

// Get a single subscription plan by ID
export const getPlanById = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching plan', error });
  }
};

// Create a new subscription plan
export const createPlan = async (req, res) => {
  try {
    const { planType, price, durationDays, description } = req.body;
    const newPlan = new SubscriptionPlan({ planType, price, durationDays, description });
    await newPlan.save();
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(400).json({ message: 'Error creating plan', error });
  }
};

// Update a subscription plan
export const updatePlan = async (req, res) => {
  try {
    const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPlan) return res.status(404).json({ message: 'Plan not found' });
    res.status(200).json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: 'Error updating plan', error });
  }
};

// Delete a subscription plan
export const deletePlan = async (req, res) => {
  try {
    const deletedPlan = await SubscriptionPlan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) return res.status(404).json({ message: 'Plan not found' });
    res.status(200).json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting plan', error });
  }
};
