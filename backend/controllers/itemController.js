import Item from '../models/Item.js';

// @desc    Fetch all items, search by keyword, or filter by tag
// @route   GET /api/items?keyword=...&tag=...
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

        // --- NEW TAG FILTER LOGIC ---
        const tagFilter = req.query.tag
            ? {
                tags: { $in: [req.query.tag] } // Check if the tag exists in the 'tags' array
            }
            : {};
        // -------------------------

        // Combine keyword search and tag filter
        const query = { ...keyword, ...tagFilter };

        const items = await Item.find(query); // Apply combined query
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ... createItem, getMyItems, updateItem, deleteItem functions remain the same ...

export const createItem = async (req, res) => {
    try {
        // Include new fields if provided
        const { name, category, price, imageUrl, countInStock, tags, nutritionInfo } = req.body;
        
        const item = new Item({
            name,
            category,
            price,
            imageUrl,
            countInStock,
            tags: tags || [], // Default to empty array if not provided
            nutritionInfo: nutritionInfo || {}, // Default to empty object
            seller: req.user._id
        });

        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ seller: req.user._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateItem = async (req, res) => {
    // Include new fields if provided
    const { name, category, price, imageUrl, countInStock, tags, nutritionInfo } = req.body;
    
    try {
        const item = await Item.findById(req.params.id);

        if (!item) return res.status(404).json({ message: 'Item not found' });
        if (item.seller.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

        item.name = name || item.name;
        item.category = category || item.category;
        item.price = price !== undefined ? price : item.price; // Allow setting price to 0
        item.imageUrl = imageUrl || item.imageUrl;
        item.countInStock = countInStock !== undefined ? countInStock : item.countInStock; // Allow setting stock to 0
        item.tags = tags || item.tags;
        item.nutritionInfo = nutritionInfo || item.nutritionInfo;

        const updatedItem = await item.save();
        res.json(updatedItem);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) return res.status(404).json({ message: 'Item not found' });
        if (item.seller.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

        await Item.deleteOne({ _id: item._id });
        res.json({ message: 'Item removed' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};