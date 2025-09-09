import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'User' 
    },
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            imageUrl: { type: String, required: true },
            price: { type: Number, required: true },
            item: { 
                type: mongoose.Schema.Types.ObjectId, 
                required: true, 
                ref: 'Item' 
            }
        }
    ],
    totalPrice: { 
        type: Number, 
        required: true, 
        default: 0.0 
    },
    status: { 
        type: String, 
        required: true, 
        default: 'Placed' 
    },
}, { 
    timestamps: true 
});

const Order = mongoose.model('Order', orderSchema);
export default Order;