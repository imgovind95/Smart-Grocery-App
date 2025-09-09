// import Item from '../models/Item.js';

// // @desc    Fetch all items
// // @route   GET /api/items
// export const getItems = async (req, res) => {
//     try {
//         const items = await Item.find({});
//         res.json(items);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // @desc    Create a new item (for seeding/admin)
// // @route   POST /api/items
// export const createItem = async (req, res) => {
//     try {
//         const { name, category, price, imageUrl } = req.body;
//         const item = new Item({ name, category, price, imageUrl });
//         const createdItem = await item.save();
//         res.status(201).json(createdItem);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
// // @desc    Fetch all items or search by keyword
// // @route   GET /api/items?keyword=...
// // export const getItems = async (req, res) => {
// //     try {
// //         const keyword = req.query.keyword 
// //             ? {
// //                 name: {
// //                     $regex: req.query.keyword, // The search term
// //                     $options: 'i', // 'i' for case-insensitive
// //                 },
// //             } 
// //             : {}; // If no keyword, this object is empty and returns all items

// //         const items = await Item.find({ ...keyword });
// //         res.json(items);
// //     } catch (error) {
// //         res.status(500).json({ message: error.message });
// //     }
// // };
import Item from '../models/Item.js';

// @desc    Fetch all items or search by keyword
// @route   GET /api/items?keyword=...
export const getItems = async (req, res) => {
    try {
        const keyword = req.query.keyword 
            ? {
                name: {
                    $regex: req.query.keyword, // The search term
                    $options: 'i', // 'i' for case-insensitive
                },
            } 
            : {}; // If no keyword, this object is empty and returns all items

        const items = await Item.find({ ...keyword });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new item (for seeding/admin)
// @route   POST /api/items
export const createItem = async (req, res) => {
    try {
        const { name, category, price, imageUrl } = req.body;
        const item = new Item({ name, category, price, imageUrl });
        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};