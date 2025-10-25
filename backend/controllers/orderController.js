import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Item from '../models/Item.js';

// @desc    Create a new order from the cart
// @route   POST /api/orders
export const createOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.item');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cannot create order from an empty cart' });
        }

        let calculatedTotalPrice = 0;
        const orderItems = [];
        
        // Stock checking and updating logic
        for (const cartItem of cart.items) {
             if (!cartItem.item) {
                 console.warn(`Skipping null item in cart for user ${req.user._id}`);
                 continue;
            }
            const itemFromDB = await Item.findById(cartItem.item._id);
            if (!itemFromDB) {
                cart.items = cart.items.filter(i => !i.item.equals(cartItem.item._id));
                await cart.save();
                return res.status(404).json({ message: `Item ${cartItem.item.name || cartItem.item._id} not found. Cart updated.` });
            }
            if (itemFromDB.countInStock < cartItem.quantity) {
                return res.status(400).json({ message: `Item ${itemFromDB.name} is out of stock.` });
            }
            orderItems.push({
                name: itemFromDB.name,
                quantity: cartItem.quantity,
                imageUrl: itemFromDB.imageUrl,
                price: itemFromDB.price,
                item: itemFromDB._id
            });
            calculatedTotalPrice += itemFromDB.price * cartItem.quantity;
            itemFromDB.countInStock -= cartItem.quantity;
            await itemFromDB.save();
        }
        
        if (orderItems.length === 0) {
             return res.status(400).json({ message: 'No valid items in cart to place order.' });
        }

        const order = new Order({
            user: req.user._id,
            orderItems: orderItems,
            totalPrice: calculatedTotalPrice
        });

        const createdOrder = await order.save();

        cart.items = [];
        await cart.save();

        // Populate items before sending response
        const populatedOrder = await Order.findById(createdOrder._id)
                                        .populate('orderItems.item', '_id name imageUrl'); // Populate necessary fields

        res.status(201).json(populatedOrder); // Send populated order back

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};


// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};
