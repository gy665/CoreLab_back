import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'secret';

export const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id.toString()}, secret, { expiresIn: '1d' });
  res.json({ token });
};



//update user

export const updateUser = async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email, currentPassword, newPassword } = req.body;
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Update regular fields if provided
      if (name) user.name = name;
      if (email) user.email = email;
  
      // Handle password update if requested
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ message: 'Current password is required to update password' });
        }
        
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
      }
  
      await user.save();
      
      // Return updated user without password
      const userToReturn = user.toObject();
      delete userToReturn.password;
      
      res.status(200).json(userToReturn);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };






  export const deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
      
      
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        console.log('No user found with ID:', userId);
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ error: error.message });
    }
  };

