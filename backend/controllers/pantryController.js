import PantryItem from '../models/PantryItem.js';
import Item from '../models/Item.js'; // Needed to check if item exists

// @desc    Get all items in the user's pantry
// @route   GET /api/pantry
export const getPantryItems = async (req, res) => {
    try {
        const pantryItems = await PantryItem.find({ user: req.user._id })
            .populate('item', 'name imageUrl category price'); // Populate item details
        res.json(pantryItems);
    } catch (error) {
        console.error('Error fetching pantry items:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add an item to the pantry (or update quantity if exists)
// @route   POST /api/pantry/add
export const addItemToPantry = async (req, res) => {
    const { itemId, quantity } = req.body;
    const userId = req.user._id;

    try {
        // Check if the item actually exists in the main Item collection
        const itemExists = await Item.findById(itemId);
        if (!itemExists) {
            return res.status(404).json({ message: 'Item not found in store' });
        }

        // Check if the item is already in the user's pantry
        let pantryItem = await PantryItem.findOne({ user: userId, item: itemId });

        if (pantryItem) {
            // If item exists, update its quantity
            pantryItem.quantity += Number(quantity) || 1; // Add the new quantity
        } else {
            // If item doesn't exist, create a new pantry entry
            pantryItem = new PantryItem({
                user: userId,
                item: itemId,
                quantity: Number(quantity) || 1,
            });
        }

        await pantryItem.save();
        
        // Populate the added/updated item before sending back
        const updatedPantryItem = await PantryItem.findById(pantryItem._id)
            .populate('item', 'name imageUrl category price');
            
        res.status(201).json(updatedPantryItem);

    } catch (error) {
        // Handle potential unique index violation (user trying to add the same item twice concurrently)
        if (error.code === 11000) {
             return res.status(400).json({ message: 'Item already exists in pantry, try updating quantity.' });
        }
        console.error('Error adding item to pantry:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update quantity of an item in the pantry
// @route   PUT /api/pantry/:id
export const updatePantryItemQuantity = async (req, res) => {
    const { quantity } = req.body;
    const pantryItemId = req.params.id;
    const userId = req.user._id;

    // Validate quantity
     if (quantity === undefined || Number(quantity) < 0) {
         return res.status(400).json({ message: 'Invalid quantity provided.' });
     }

    try {
        const pantryItem = await PantryItem.findById(pantryItemId);

        if (!pantryItem) {
            return res.status(404).json({ message: 'Pantry item not found' });
        }

        // Ensure the item belongs to the logged-in user
        if (pantryItem.user.toString() !== userId.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this item' });
        }

        pantryItem.quantity = Number(quantity);
        await pantryItem.save();
        
        // Populate the updated item before sending back
        const updatedPantryItem = await PantryItem.findById(pantryItem._id)
            .populate('item', 'name imageUrl category price');

        res.json(updatedPantryItem);

    } catch (error) {
        console.error('Error updating pantry item quantity:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Remove an item from the pantry
// @route   DELETE /api/pantry/:id
export const removePantryItem = async (req, res) => {
    const pantryItemId = req.params.id;
    const userId = req.user._id;

    try {
        const pantryItem = await PantryItem.findById(pantryItemId);

        if (!pantryItem) {
            return res.status(404).json({ message: 'Pantry item not found' });
        }

        // Ensure the item belongs to the logged-in user
        if (pantryItem.user.toString() !== userId.toString()) {
            return res.status(401).json({ message: 'Not authorized to remove this item' });
        }

        await PantryItem.deleteOne({ _id: pantryItemId });
        res.json({ message: 'Item removed from pantry' });

    } catch (error) {
        console.error('Error removing pantry item:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get suggestions for items low in stock (e.g., quantity <= 1)
// @route   GET /api/pantry/suggestions
export const getPantrySuggestions = async (req, res) => {
    const lowStockThreshold = 1; // Define what 'low stock' means (e.g., quantity 1 or less)
    try {
        const lowStockItems = await PantryItem.find({
            user: req.user._id,
            quantity: { $lte: lowStockThreshold } // Find items with quantity <= threshold
        }).populate('item', 'name imageUrl category price'); // Populate item details

        res.json(lowStockItems);
    } catch (error) {
        console.error('Error fetching pantry suggestions:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};