import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    instructions: {
        type: String, // Or you could use an array of strings for steps
        required: true,
    },
    ingredients: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Item', // Reference to our Item model
            },
            quantity: {
                type: Number, // This is the quantity needed for the recipe
                required: true,
                default: 1,
            },
            // Optional: Unit like 'grams', 'ml', 'pcs'
            unit: {
                type: String,
                default: 'unit(s)',
            },
        },
    ],
    // Optional fields
    prepTime: String, // e.g., "15 mins"
    cookTime: String, // e.g., "30 mins"
    servings: Number, // e.g., 4
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;