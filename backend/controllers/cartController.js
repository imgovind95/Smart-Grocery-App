import Cart from '../models/Cart.js';
import Item from '../models/Item.js';

// @desc    Get user's cart
// @route   GET /api/cart
export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.item');
        if (!cart) {
            // If no cart, create one for the user
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
export const addToCart = async (req, res) => {
    const { itemId, quantity } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        const itemIndex = cart.items.findIndex(p => p.item.equals(itemId));

        if (itemIndex > -1) {
            // Item exists, update quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Item does not exist, add new item
            cart.items.push({ item: itemId, quantity });
        }
        await cart.save();
        const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.item');
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/item/:itemId
export const removeFromCart = async (req, res) => {
    const { itemId } = req.params;
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        cart.items = cart.items.filter(p => !p.item.equals(itemId));
        await cart.save();
        const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.item');
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};