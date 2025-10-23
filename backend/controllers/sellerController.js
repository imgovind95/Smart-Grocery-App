import Order from '../models/Order.js';
import Item from '../models/Item.js';

// @desc    Get sales stats for the logged-in seller
// @route   GET /api/seller/stats
export const getSellerStats = async (req, res) => {
    try {
        // 1. Find all items belonging to this seller
        const sellerItems = await Item.find({ seller: req.user._id }).select('_id');
        const sellerItemIds = sellerItems.map(item => item._id);

        if (sellerItemIds.length === 0) {
            // Agar seller ke paas koi item nahi hai, toh 0 stats bhej do
            return res.json({
                totalRevenue: 0,
                totalItemsSold: 0,
                totalCustomers: 0,
            });
        }

        // 2. Use MongoDB Aggregation to analyze the Order collection
        const stats = await Order.aggregate([
            {
                // Step 1: Har order ke andar 'orderItems' array ko alag-alag document mein todo
                $unwind: '$orderItems'
            },
            {
                // Step 2: Sirf woh order items rakho jo is seller ke hain
                $match: {
                    'orderItems.item': { $in: sellerItemIds }
                }
            },
            {
                // Step 3: Data ko group karke calculate karo
                $group: {
                    _id: null, // Sabko ek hi group mein daalo
                    totalRevenue: { 
                        $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } 
                    },
                    totalItemsSold: { 
                        $sum: '$orderItems.quantity' 
                    },
                    totalCustomers: { 
                        $addToSet: '$user' // Unique user IDs ko add karo
                    }
                }
            },
            {
                // Step 4: Output ko sundar format do
                $project: {
                    _id: 0, // _id field ko hata do
                    totalRevenue: '$totalRevenue',
                    totalItemsSold: '$totalItemsSold',
                    totalCustomers: { $size: '$totalCustomers' } // Unique users ka count
                }
            }
        ]);

        if (stats.length > 0) {
            res.json(stats[0]);
        } else {
            // Agar koi sale nahi hui hai
            res.json({
                totalRevenue: 0,
                totalItemsSold: 0,
                totalCustomers: 0,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};