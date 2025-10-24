import mongoose from 'mongoose';

const pantryItemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Item',
    },
    quantity: {
        type: Number,
        required: true,
        min: 0, // Quantity can be 0 or more
        default: 1,
    },
    // Optional fields you might add later
    // purchaseDate: { type: Date },
    // expiryDate: { type: Date },
    // lowStockThreshold: { type: Number, default: 1 } // Threshold for suggestions
}, {
    timestamps: true,
    // Ensure a user can only have one entry per item
    unique: ['user', 'item']
});

// Create a unique index for user and item combination
pantryItemSchema.index({ user: 1, item: 1 }, { unique: true });

const PantryItem = mongoose.model('PantryItem', pantryItemSchema);
export default PantryItem;