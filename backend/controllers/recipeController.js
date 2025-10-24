import Recipe from '../models/Recipe.js';

// @desc    Fetch all recipes
// @route   GET /api/recipes
export const getRecipes = async (req, res) => {
    try {
        // Fetch all recipes, but only select basic fields for the list view
        const recipes = await Recipe.find({}).select('name description imageUrl');
        res.json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching recipes' });
    }
};

// @desc    Fetch a single recipe by ID, including ingredients
// @route   GET /api/recipes/:id
export const getRecipeById = async (req, res) => {
    try {
        // Fetch the recipe and populate the 'item' details within the ingredients array
        const recipe = await Recipe.findById(req.params.id).populate('ingredients.item');

        if (recipe) {
            res.json(recipe);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching recipe details' });
    }
};

// Note: We might need a function later to add recipes (e.g., via admin or another seeder)