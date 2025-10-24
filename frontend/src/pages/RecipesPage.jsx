import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const RecipeCard = ({ recipe }) => (
    <Link to={`/recipes/${recipe._id}`} className="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105">
        <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-48 object-cover" />
        <div className="p-4">
            <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">{recipe.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{recipe.description}</p>
        </div>
    </Link>
);

const RecipesPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                setError('');
                const { data } = await api.get('/api/recipes');
                setRecipes(data);
            } catch (err) {
                console.error("Failed to fetch recipes", err);
                setError('Could not load recipes. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    if (loading) {
        return <p className="text-center mt-8 dark:text-gray-300">Loading recipes...</p>;
    }

    if (error) {
        return <p className="text-center mt-8 text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-6xl mx-auto mt-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Recipes</h1>
            {recipes.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">No recipes available right now.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe._id} recipe={recipe} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecipesPage;