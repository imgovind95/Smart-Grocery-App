import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext'; // To add suggestions to cart

const MyPantryPage = () => {
    const [pantryItems, setPantryItems] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { addToCart } = useCart();

    // Function to fetch both pantry items and suggestions
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const [pantryRes, suggestionsRes] = await Promise.all([
                api.get('/api/pantry'),
                api.get('/api/pantry/suggestions')
            ]);
            setPantryItems(pantryRes.data);
            setSuggestions(suggestionsRes.data);
        } catch (err) {
            console.error("Failed to fetch pantry data", err);
            setError(err.response?.data?.message || 'Could not load pantry data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdateQuantity = async (pantryItemId, newQuantity) => {
        if (newQuantity < 0) return; // Prevent negative quantity

        try {
            // Optimistic UI update (update state immediately)
            setPantryItems(prevItems =>
                prevItems.map(p =>
                    p._id === pantryItemId ? { ...p, quantity: newQuantity } : p
                )
            );
             // Also update suggestions if the item was there
            setSuggestions(prevSuggestions =>
                 prevSuggestions.map(s =>
                     s._id === pantryItemId ? { ...s, quantity: newQuantity } : s
                 ).filter(s => s.quantity > 0) // Remove if quantity becomes > 0
             );


            // Make API call to update backend
            await api.put(`/api/pantry/${pantryItemId}`, { quantity: newQuantity });
            
            // Optionally: Refetch suggestions if quantity changed around the threshold
            // await fetchData(); // Or just update suggestions locally

        } catch (err) {
            console.error("Failed to update quantity", err);
            alert('Could not update quantity. Please refresh and try again.');
            // Revert optimistic update on error
            fetchData();
        }
    };

    const handleRemoveItem = async (pantryItemId) => {
        if (window.confirm('Are you sure you want to remove this item from your pantry?')) {
            try {
                // Optimistic UI update
                setPantryItems(prevItems => prevItems.filter(p => p._id !== pantryItemId));
                setSuggestions(prevSuggestions => prevSuggestions.filter(s => s._id !== pantryItemId));

                // Make API call
                await api.delete(`/api/pantry/${pantryItemId}`);
            } catch (err) {
                console.error("Failed to remove item", err);
                alert('Could not remove item. Please refresh and try again.');
                // Revert optimistic update
                fetchData();
            }
        }
    };

     const handleAddSuggestionToCart = (item) => {
         if (item && item.item && item.item._id) {
             addToCart(item.item._id, 1); // Add 1 unit to cart
             alert(`${item.item.name} added to cart.`);
             // Optionally remove from suggestions after adding to cart
             setSuggestions(prev => prev.filter(s => s._id !== item._id));
         } else {
              console.error("Invalid suggestion item:", item);
              alert("Could not add item to cart - item data missing.");
         }
     };

    if (loading) {
        return <p className="text-center mt-8 dark:text-gray-300">Loading your pantry...</p>;
    }

    if (error) {
        return <p className="text-center mt-8 text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-6xl mx-auto mt-8 space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Pantry</h1>

            {/* Suggestions Section */}
            {suggestions.length > 0 && (
                <div className="bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 p-4 rounded-md shadow">
                    <h2 className="text-xl font-semibold mb-3 text-yellow-800 dark:text-yellow-200">Refill Suggestions (Low Stock!)</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {suggestions.map((pantryItem) => (
                           pantryItem.item && ( // Ensure item data exists
                                <div key={pantryItem._id} className="bg-white dark:bg-gray-800 p-3 rounded shadow text-center">
                                    <img src={pantryItem.item.imageUrl} alt={pantryItem.item.name} className="w-16 h-16 object-cover mx-auto mb-2 rounded"/>
                                    <p className="text-sm font-medium dark:text-gray-200">{pantryItem.item.name}</p>
                                    <p className="text-xs text-red-600 dark:text-red-400 mb-2">Only {pantryItem.quantity} left</p>
                                    <button
                                        onClick={() => handleAddSuggestionToCart(pantryItem)}
                                        className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}

            {/* Pantry Items List */}
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Items in Your Pantry</h2>
                {pantryItems.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400">Your pantry is empty. Add items you have at home!</p>
                ) : (
                    <div className="space-y-4">
                        {pantryItems.map((pantryItem) => (
                           pantryItem.item && ( // Ensure item data exists
                                <div key={pantryItem._id} className="flex flex-col sm:flex-row justify-between items-center p-4 border dark:border-gray-700 rounded-lg gap-4">
                                    <div className="flex items-center space-x-4 flex-grow">
                                        <img src={pantryItem.item.imageUrl} alt={pantryItem.item.name} className="w-16 h-16 object-cover rounded flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-lg dark:text-gray-200">{pantryItem.item.name}</h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">{pantryItem.item.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 flex-shrink-0">
                                        <button
                                            onClick={() => handleUpdateQuantity(pantryItem._id, pantryItem.quantity - 1)}
                                            disabled={pantryItem.quantity <= 0}
                                            className="bg-gray-300 dark:bg-gray-600 px-3 py-1 rounded disabled:opacity-50"
                                        >
                                            -
                                        </button>
                                        <span className="font-semibold dark:text-gray-200 w-8 text-center">{pantryItem.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(pantryItem._id, pantryItem.quantity + 1)}
                                            className="bg-gray-300 dark:bg-gray-600 px-3 py-1 rounded"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => handleRemoveItem(pantryItem._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 ml-4"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
                 {/* Optional: Add functionality later to manually add items to pantry */}
                 {/* <div className="mt-6 text-center">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                          Manually Add Item to Pantry
                      </button>
                 </div> */}
            </div>
        </div>
    );
};

export default MyPantryPage;