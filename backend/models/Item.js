import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
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

    // --- NEW FIELDS ADDED ---
    tags: {
        type: [String], // Array of strings like 'vegan', 'high-protein', 'organic'
        default: []
    },
    nutritionInfo: { // Basic nutritional info (can be expanded later)
        calories: { type: Number },
        protein: { type: Number }, // in grams
        // Add more fields like carbs, fat, etc. if needed
    },
    // -------------------------

}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);
export default Item;