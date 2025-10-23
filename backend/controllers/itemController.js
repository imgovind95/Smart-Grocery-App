import Item from '../models/Item.js';

// @desc    Fetch all items or search by keyword
// @route   GET /api/items?keyword=...
export const getItems = async (req, res) => {
    try {
        const keyword = req.query.keyword 
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            } 
            : {};

        const items = await Item.find({ ...keyword });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new item (for sellers)
// @route   POST /api/items
export const createItem = async (req, res) => {
    try {
        const { name, category, price, imageUrl } = req.body;
        
        const item = new Item({
            name,
            category,
            price,
            imageUrl,
            seller: req.user._id  // Item ko logged-in seller se link karein
        });

        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get items for the logged-in seller
// @route   GET /api/items/my-items
export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ seller: req.user._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- YEH DO NAYE FUNCTIONS ADD KIYE GAYE HAIN ---

// @desc    Update an item
// @route   PUT /api/items/:id
export const updateItem = async (req, res) => {
    const { name, category, price, imageUrl } = req.body;
    
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Security Check: Kya yeh item isi seller ka hai?
        if (item.seller.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Data update karein
        item.name = name || item.name;
        item.category = category || item.category;
        item.price = price || item.price;
        item.imageUrl = imageUrl || item.imageUrl;

        const updatedItem = await item.save();
        res.json(updatedItem);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
export const deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Security Check: Kya yeh item isi seller ka hai?
        if (item.seller.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Item.deleteOne({ _id: item._id });
        res.json({ message: 'Item removed' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};