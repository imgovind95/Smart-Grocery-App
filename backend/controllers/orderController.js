import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Item from '../models/Item.js'; // Item model ko import karein

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
            // Safety check in case item was deleted but still in cart
            if (!cartItem.item) {
                 console.warn(`Skipping null item in cart for user ${req.user._id}`);
                 continue; // Skip this item
            }

            const itemFromDB = await Item.findById(cartItem.item._id);
            if (!itemFromDB) {
                // Remove item from cart if it no longer exists
                cart.items = cart.items.filter(i => !i.item.equals(cartItem.item._id));
                await cart.save();
                return res.status(404).json({ message: `Item ${cartItem.item.name || cartItem.item._id} not found in store. Cart updated.` });
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
            itemFromDB.countInStock -= cartItem.quantity; // Stock kam karein
            await itemFromDB.save();
        }
        
        // If all items were invalid/removed, orderItems might be empty
        if (orderItems.length === 0) {
             return res.status(400).json({ message: 'No valid items in cart to place order.' });
        }

        const order = new Order({
            user: req.user._id,
            orderItems: orderItems,
            totalPrice: calculatedTotalPrice
        });

        const createdOrder = await order.save();

        cart.items = []; // Cart khaali karein
        await cart.save();

        res.status(201).json(createdOrder);

    } catch (error) {
        console.error(error); // Error log karein
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};


// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
export const getMyOrders = async (req, res) => {
    try {
        // User ID ke basis par orders dhoondhein aur naye se puraane sort karein
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error); // Error log karein
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};