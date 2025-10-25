import PantryItem from '../models/PantryItem.js';
import Item from '../models/Item.js';

// @desc    Get all items in the user's pantry
// @route   GET /api/pantry
export const getPantryItems = async (req, res) => {
    try {
        const pantryItems = await PantryItem.find({ user: req.user._id })
            .populate('item', 'name imageUrl category price')
            .sort({ expiryDate: 1 }); // Sort by expiry date (optional)
        res.json(pantryItems);
    } catch (error) {
        console.error('Error fetching pantry items:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add an item to the pantry (or update quantity if exists)
// @route   POST /api/pantry/add
export const addItemToPantry = async (req, res) => {
    // Include expiryDate from request body
    const { itemId, quantity, expiryDate } = req.body;
    const userId = req.user._id;

    try {
        const itemExists = await Item.findById(itemId);
        if (!itemExists) {
            return res.status(404).json({ message: 'Item not found in store' });
        }

        let pantryItem = await PantryItem.findOne({ user: userId, item: itemId });

        if (pantryItem) {
            // Update quantity and optionally expiry date
            pantryItem.quantity += Number(quantity) || 1;
            if (expiryDate) pantryItem.expiryDate = expiryDate; // Update expiry date if provided
        } else {
            // Create new entry with expiry date
            pantryItem = new PantryItem({
                user: userId,
                item: itemId,
                quantity: Number(quantity) || 1,
                expiryDate: expiryDate || null, // Save expiry date or null
            });
        }

        await pantryItem.save();

        const updatedPantryItem = await PantryItem.findById(pantryItem._id)
            .populate('item', 'name imageUrl category price');

        res.status(201).json(updatedPantryItem);

    } catch (error) {
        if (error.code === 11000) {
             return res.status(400).json({ message: 'Item already exists in pantry.' });
        }
        console.error('Error adding item to pantry:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update quantity AND/OR expiry date of an item in the pantry
// @route   PUT /api/pantry/:id
export const updatePantryItem = async (req, res) => {
    // Accept both quantity and expiryDate
    const { quantity, expiryDate } = req.body;
    const pantryItemId = req.params.id;
    const userId = req.user._id;

    // Basic validation
    if (quantity !== undefined && Number(quantity) < 0) {
         return res.status(400).json({ message: 'Invalid quantity provided.' });
    }
    // You might want more robust date validation for expiryDate

    try {
        const pantryItem = await PantryItem.findById(pantryItemId);

        if (!pantryItem) {
            return res.status(404).json({ message: 'Pantry item not found' });
        }
        if (pantryItem.user.toString() !== userId.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Update fields if they are provided in the request body
        if (quantity !== undefined) {
            pantryItem.quantity = Number(quantity);
        }
        if (expiryDate !== undefined) {
            // Allow setting expiryDate to null if an empty string is sent
            pantryItem.expiryDate = expiryDate ? expiryDate : null;
        }

        await pantryItem.save();

        const updatedPantryItem = await PantryItem.findById(pantryItem._id)
            .populate('item', 'name imageUrl category price');

        res.json(updatedPantryItem);

    } catch (error) {
        console.error('Error updating pantry item:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Remove an item from the pantry
// @route   DELETE /api/pantry/:id
export const removePantryItem = async (req, res) => {
    // (No changes needed in this function)
    const pantryItemId = req.params.id;
    const userId = req.user._id;
    try {
        const pantryItem = await PantryItem.findById(pantryItemId);
        if (!pantryItem) return res.status(404).json({ message: 'Pantry item not found' });
        if (pantryItem.user.toString() !== userId.toString()) return res.status(401).json({ message: 'Not authorized' });
        await PantryItem.deleteOne({ _id: pantryItemId });
        res.json({ message: 'Item removed from pantry' });
    } catch (error) {
        console.error('Error removing pantry item:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get suggestions for items low in stock
// @route   GET /api/pantry/suggestions
export const getPantrySuggestions = async (req, res) => {
    // (No changes needed in this function)
    const lowStockThreshold = 1;
    try {
        const lowStockItems = await PantryItem.find({
            user: req.user._id,
            quantity: { $lte: lowStockThreshold }
        }).populate('item', 'name imageUrl category price');
        res.json(lowStockItems);
    } catch (error) {
        console.error('Error fetching pantry suggestions:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- NEW FUNCTION ADDED ---
// @desc    Get items expiring soon (e.g., within the next 7 days)
// @route   GET /api/pantry/expiring
export const getExpiringItems = async (req, res) => {
    try {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7); // Set date 7 days from now

        const expiringItems = await PantryItem.find({
            user: req.user._id,
            expiryDate: {
                $ne: null,        // Ensure expiryDate exists
                $gte: today,      // Expiry date is today or later
                $lte: nextWeek    // Expiry date is within the next 7 days
            }
        })
        .populate('item', 'name imageUrl category price')
        .sort({ expiryDate: 1 }); // Sort by soonest expiry date first

        res.json(expiringItems);
    } catch (error) {
        console.error('Error fetching expiring items:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// --------------------------