import EquipmentPurchase from '../models/equipmentpurchase.model.js';
import Equipment from '../models/equipment.model.js';
import User from '../models/user.model.js';

// Create a new purchase
export const createPurchase = async (req, res) => {
  try {
    const { user, equipment, quantityPurchased } = req.body;

    const foundUser = await User.findById(user);
    if (!foundUser) return res.status(404).json({ message: "User not found" });

    const foundEquipment = await Equipment.findById(equipment);
    if (!foundEquipment) return res.status(404).json({ message: "Equipment not found" });

    if (foundEquipment.quantity < quantityPurchased) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    const totalPrice = foundEquipment.price * quantityPurchased;

    // Update equipment stock
    foundEquipment.quantity -= quantityPurchased;
    await foundEquipment.save();

    const newPurchase = await EquipmentPurchase.create({
      user,
      equipment,
      quantityPurchased,
      totalPrice
    });

    res.status(201).json(newPurchase);
  } catch (error) {
    console.error("Purchase error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all purchases
export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await EquipmentPurchase.find()
      .populate('user', 'name email')
      .populate('equipment', 'name price');
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get purchases by user
export const getPurchasesByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const purchases = await EquipmentPurchase.find({ user: userId })
      .populate('equipment', 'name price');
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single purchase
export const getSinglePurchase = async (req, res) => {
  try {
    const purchase = await EquipmentPurchase.findById(req.params.id)
      .populate('user', 'name email')
      .populate('equipment', 'name price');
    if (!purchase) return res.status(404).json({ message: "Purchase not found" });

    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
