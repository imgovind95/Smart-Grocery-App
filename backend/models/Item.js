import mongoose from 'mongoose';

const vendorPriceSchema = new mongoose.Schema({
    storeName: { type: String, required: true },
    price: { type: Number, required: true },
    // Optional: lastChecked: { type: Date }
}, { _id: false }); // Don't create separate IDs for each vendor price entry

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true }, // Main price on THIS platform
    imageUrl: { type: String, required: true },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    },
    tags: {
        type: [String],
        default: []
    },
    nutritionInfo: {
        calories: { type: Number },
        protein: { type: Number },
    },

    // --- NEW FIELD ADDED ---
    vendors: {
        type: [vendorPriceSchema], // Array to store prices from other stores
        default: []
    }
    // -------------------------

}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);
export default Item;