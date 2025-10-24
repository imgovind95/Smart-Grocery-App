import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext'; // Import useCart

const RecipeDetailPage = () => {
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams(); // Get recipe ID from URL
    const { addToCart } = useCart(); // Get addToCart function
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                setLoading(true);
                setError('');
                const { data } = await api.get(`/api/recipes/${id}`);
                setRecipe(data);
            } catch (err) {
                console.error("Failed to fetch recipe details", err);
                setError('Could not load recipe details.');
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    const handleAddIngredientsToCart = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            alert('Please log in to add items to your cart.');
            navigate('/login');
            return;
        }
        if (!recipe || !recipe.ingredients) return;

        try {
            // Add each ingredient to the cart one by one
            // Note: A backend endpoint to add multiple items at once would be more efficient
            for (const ingredient of recipe.ingredients) {
                 if (ingredient.item && ingredient.item._id) { // Check if item exists
                     await addToCart(ingredient.item._id, ingredient.quantity);
                 } else {
                      console.warn(`Skipping ingredient with missing item data: ${ingredient}`);
                 }
            }
            alert('Ingredients added to cart!');
            navigate('/cart'); // Go to cart page after adding
        } catch (err) {
            console.error("Failed to add ingredients to cart", err);
            alert('Could not add all ingredients. Some might be out of stock or unavailable.');
        }
    };


    if (loading) {
        return <p className="text-center mt-8 dark:text-gray-300">Loading recipe...</p>;
    }

    if (error) {
        return <p className="text-center mt-8 text-red-500">{error}</p>;
    }

    if (!recipe) {
        return <p className="text-center mt-8 dark:text-gray-400">Recipe not found.</p>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6">
            <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-64 object-cover rounded-md mb-6" />
            <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">{recipe.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{recipe.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {recipe.prepTime && <p className="dark:text-gray-300"><strong>Prep Time:</strong> {recipe.prepTime}</p>}
                {recipe.cookTime && <p className="dark:text-gray-300"><strong>Cook Time:</strong> {recipe.cookTime}</p>}
                {recipe.servings && <p className="dark:text-gray-300"><strong>Servings:</strong> {recipe.servings}</p>}
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700 dark:text-gray-200">Ingredients</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    {recipe.ingredients.map((ing, index) => (
                         // Check if ingredient.item is populated correctly
                        <li key={index}>
                           {ing.item ? `${ing.quantity} ${ing.unit || ''} ${ing.item.name}` : `Ingredient data missing`}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3 text-gray-700 dark:text-gray-200">Instructions</h2>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{recipe.instructions}</p>
            </div>

            <button
                onClick={handleAddIngredientsToCart}
                className="w-full bg-green-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors"
            >
                Add All Ingredients to Cart
            </button>
        </div>
    );
};

export default RecipeDetailPage;