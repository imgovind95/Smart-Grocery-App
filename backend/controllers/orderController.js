import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

// @desc    Create a new order from the cart
// @route   POST /api/orders
export const createOrder = async (req, res) => {
    try {
        // Find the user's cart and populate the item details
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.item');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cannot create order from an empty cart' });
        }

        // Calculate total price and create order items from cart items
        let calculatedTotalPrice = 0;
        const orderItems = cart.items.map(cartItem => {
            calculatedTotalPrice += cartItem.item.price * cartItem.quantity;
            return {
                name: cartItem.item.name,
                quantity: cartItem.quantity,
                imageUrl: cartItem.item.imageUrl,
                price: cartItem.item.price,
                item: cartItem.item._id
            };
        });
        
        // Create a new order instance
        const order = new Order({
            user: req.user._id,
            orderItems: orderItems,
            totalPrice: calculatedTotalPrice
        });

        const createdOrder = await order.save();

        // After creating the order, clear the user's cart
        cart.items = [];
        await cart.save();

        res.status(201).json(createdOrder);

    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};