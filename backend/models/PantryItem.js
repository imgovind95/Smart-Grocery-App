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
        min: 0,
        default: 1,
    },
    // --- NEW FIELD ADDED ---
    expiryDate: {
        type: Date, // Store expiry date
        required: false // Make it optional initially
    },
    // -------------------------
    // lowStockThreshold: { type: Number, default: 1 } // Threshold for suggestions
}, {
    timestamps: true,
});

// Create a unique index for user and item combination
pantryItemSchema.index({ user: 1, item: 1 }, { unique: true });

const PantryItem = mongoose.model('PantryItem', pantryItemSchema);
export default PantryItem;