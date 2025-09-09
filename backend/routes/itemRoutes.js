import express from 'express';
import { getItems, createItem } from '../controllers/itemController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// New, secure code
router.route('/').get(protect, getItems).post(protect, createItem);
// New Code
// router.route('/').get(getItems).post(protect, createItem);

export default router;