import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true // Each user has one cart
    },
    items: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Item'
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            }
        }
    ]
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;