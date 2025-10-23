import express from 'express';
// Naye functions ko import karein
import { getItems, createItem, getMyItems, updateItem, deleteItem } from '../controllers/itemController.js';
import { protect, isSeller } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route (sabhi items dekhne ke liye)
router.route('/').get(getItems);

// Seller routes
router.route('/my-items').get(protect, isSeller, getMyItems);
router.route('/').post(protect, isSeller, createItem); 

// --- YEH NAYI LINE ADD KI GAYI HAI ---
// Edit aur Delete ke liye naye routes (ID se)
router
    .route('/:id')
    .put(protect, isSeller, updateItem)
    .delete(protect, isSeller, deleteItem);

export default router;