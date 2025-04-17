import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const secret = process.env.JWT_SECRET || 'secret';

export const protect = async (req, res, next) => {
  // 1. Extract token
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, secret);
    console.log('Decoded token payload:', decoded); // Debug

    // 3. Find user (with error handling)
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.error(`User ${decoded.userId} not found`);
      return res.status(401).json({ 
        message: 'Account no longer exists',
        code: 'USER_NOT_FOUND' 
      });
    }

    // 4. Attach user and proceed
    req.user = user;
    next();
    
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ 
      message: 'Invalid or expired token',
      code: 'INVALID_TOKEN'
    });
  }
};