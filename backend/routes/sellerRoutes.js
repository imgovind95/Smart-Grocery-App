import express from 'express';
import { getSellerStats } from '../controllers/sellerController.js';
import { protect, isSeller } from '../middleware/authMiddleware.js';

const router = express.Router();

// Sabhi seller routes protected hain aur 'isSeller' check karte hain
router.route('/stats').get(protect, isSeller, getSellerStats);

export default router;