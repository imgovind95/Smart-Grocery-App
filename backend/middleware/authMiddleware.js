import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // --- YEH LINE BADLI GAYI HAI ---
      // Humne .select('-password') hata diya hai taaki user ka 'role' bhi fetch ho
      req.user = await User.findById(decoded.id); 
      // Ya, behtar tareeka hai:
      // req.user = await User.findById(decoded.id).select('_id name email role');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const isSeller = (req, res, next) => {
  if (req.user && req.user.role === 'seller') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a seller' });
  }
};