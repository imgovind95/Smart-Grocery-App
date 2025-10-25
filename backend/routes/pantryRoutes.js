import express from 'express';
import {
    getPantryItems,
    addItemToPantry,
    updatePantryItem, // Renamed from updatePantryItemQuantity
    removePantryItem,
    getPantrySuggestions,
    getExpiringItems // Import new controller function
} from '../controllers/pantryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Apply protect middleware to all routes in this file

router.route('/')
    .get(getPantryItems);

router.route('/add')
    .post(addItemToPantry);

router.route('/suggestions')
     .get(getPantrySuggestions);

// --- NEW ROUTE ADDED ---
router.route('/expiring')
     .get(getExpiringItems); // Route to get items expiring soon
// ----------------------

router.route('/:id')
    .put(updatePantryItem) // Use the updated controller function
    .delete(removePantryItem);

export default router;