import Item from '../models/Item.js';

// ... getItems function same rahega ...
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

// --- createItem function ko update kiya gaya hai ---
export const createItem = async (req, res) => {
    try {
        // countInStock ko req.body se lein
        const { name, category, price, imageUrl, countInStock } = req.body;
        
        const item = new Item({
            name,
            category,
            price,
            imageUrl,
            countInStock, // Ise yahaan add karein
            seller: req.user._id
        });

        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ... getMyItems function same rahega ...
export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ seller: req.user._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- updateItem function ko update kiya gaya hai ---
export const updateItem = async (req, res) => {
    // countInStock ko req.body se lein
    const { name, category, price, imageUrl, countInStock } = req.body;
    
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.seller.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Data update karein
        item.name = name || item.name;
        item.category = category || item.category;
        item.price = price || item.price;
        item.imageUrl = imageUrl || item.imageUrl;
        item.countInStock = countInStock || item.countInStock; // Ise yahaan update karein

        const updatedItem = await item.save();
        res.json(updatedItem);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ... deleteItem function same rahega ...
export const deleteItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.seller.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Item.deleteOne({ _id: item._id });
        res.json({ message: 'Item removed' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};