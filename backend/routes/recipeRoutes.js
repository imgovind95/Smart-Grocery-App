import express from 'express';
import { getRecipes, getRecipeById } from '../controllers/recipeController.js';
// Note: These routes can be public, no 'protect' middleware needed for viewing

const router = express.Router();

router.route('/').get(getRecipes);
router.route('/:id').get(getRecipeById);

export default router;