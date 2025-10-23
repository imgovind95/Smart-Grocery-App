import express from 'express';
// getMyOrders ko import karein
import { createOrder, getMyOrders } from '../controllers/orderController.js'; 
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route 1: Naya order create karne ke liye (protected)
router.route('/').post(protect, createOrder);

// Route 2: User ke khud ke orders fetch karne ke liye (protected)
router.route('/myorders').get(protect, getMyOrders); 

export default router;