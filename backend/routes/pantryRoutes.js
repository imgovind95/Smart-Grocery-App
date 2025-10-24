import express from 'express';
import {
    getPantryItems,
    addItemToPantry,
    updatePantryItemQuantity,
    removePantryItem,
    getPantrySuggestions
} from '../controllers/pantryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All pantry routes require the user to be logged in
router.use(protect);

router.route('/')
    .get(getPantryItems); // Get all items

router.route('/add')
    .post(addItemToPantry); // Add item (or update if exists)

router.route('/suggestions')
     .get(getPantrySuggestions); // Get low stock suggestions

router.route('/:id')
    .put(updatePantryItemQuantity) // Update quantity by pantry item ID
    .delete(removePantryItem); // Remove item by pantry item ID

export default router;