import express from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All cart routes are protected
router.use(protect);

router.route('/')
    .get(getCart)
    .post(addToCart);

router.route('/item/:itemId')
    .delete(removeFromCart);

export default router;