import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext'; // To add suggestions to cart

// Helper function to format date for input field (YYYY-MM-DD)
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        // Adjust for timezone offset to get the correct local date
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - (offset*60*1000));
        return adjustedDate.toISOString().split('T')[0];
    } catch (e) {
        console.error("Error formatting date:", e);
        return ''; // Handle invalid date format
    }
};

const MyPantryPage = () => {
    const [pantryItems, setPantryItems] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [expiringItems, setExpiringItems] = useState([]); // State for expiring items
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { addToCart } = useCart();

    // Function to fetch pantry items, suggestions, and expiring items
    const fetchData = useCallback(async () => {
        // Don't try to fetch if not logged in (avoids potential 401 errors shown to user)
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
             setLoading(false);
             setError("Please log in to view your pantry.");
             return;
        }

        try {
            setLoading(true);
            setError('');
            // Fetch all three data points concurrently
            const [pantryRes, suggestionsRes, expiringRes] = await Promise.all([
                api.get('/api/pantry'),
                api.get('/api/pantry/suggestions'),
                api.get('/api/pantry/expiring') // Fetch expiring items
            ]);
            setPantryItems(pantryRes.data);
            setSuggestions(suggestionsRes.data);
            setExpiringItems(expiringRes.data); // Set expiring items state
        } catch (err) {
            console.error("Failed to fetch pantry data", err);
             // Handle specific errors like 401 Unauthorized if token expired
             if (err.response && err.response.status === 401) {
                 setError("Your session may have expired. Please log in again.");
                 // Optionally clear user info and redirect to login
                 // localStorage.removeItem('userInfo');
                 // navigate('/login');
             } else {
                setError(err.response?.data?.message || 'Could not load pantry data.');
             }
            setPantryItems([]); // Clear data on error
            setSuggestions([]);
            setExpiringItems([]);
        } finally {
            setLoading(false);
        }
    }, []); // Removed navigate from dependencies

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Function to handle updating quantity OR expiry date
    const handleUpdateItem = async (pantryItemId, updates) => {
        const currentItem = pantryItems.find(p => p._id === pantryItemId);
        if (!currentItem) return;

        // Ensure quantity doesn't go below 0
        if (updates.quantity !== undefined && updates.quantity < 0) {
            updates.quantity = 0;
        }

        // Optimistic UI update
        const originalItems = [...pantryItems]; // Store original state for revert
        setPantryItems(prevItems =>
            prevItems.map(p =>
                p._id === pantryItemId ? { ...p, ...updates } : p
            )
        );

        try {
            await api.put(`/api/pantry/${pantryItemId}`, updates);
            // If update was successful, refetch data to get consistent state
            // (especially for suggestions/expiring lists)
             await fetchData(); // Refetch all data after successful update
        } catch (err) {
            console.error("Failed to update item", err);
            alert('Could not update item. Please try again.');
            // Revert optimistic update on error
            setPantryItems(originalItems);
        }
    };


    const handleRemoveItem = async (pantryItemId) => {
        if (window.confirm('Remove this item from your pantry?')) {
             const originalItems = [...pantryItems]; // Store original state
            try {
                // Optimistic UI update
                setPantryItems(prevItems => prevItems.filter(p => p._id !== pantryItemId));
                setSuggestions(prevSuggestions => prevSuggestions.filter(s => s._id !== pantryItemId));
                setExpiringItems(prevExpiring => prevExpiring.filter(e => e._id !== pantryItemId));

                await api.delete(`/api/pantry/${pantryItemId}`);
            } catch (err) {
                console.error("Failed to remove item", err);
                alert('Could not remove item. Please try again.');
                setPantryItems(originalItems); // Revert UI on error
                // Optionally refetch all data: fetchData();
            }
        }
    };

     const handleAddSuggestionToCart = (item) => {
         const userInfo = JSON.parse(localStorage.getItem('userInfo'));
         if (!userInfo) {
             alert("Please log in to add items to the cart.");
             // Optionally redirect: navigate('/login');
             return;
         }
         if (item && item.item && item.item._id) {
             addToCart(item.item._id, 1);
             alert(`${item.item.name} added to cart.`);
             // Optimistically remove from suggestions UI
             setSuggestions(prev => prev.filter(s => s._id !== item._id));
         } else {
              console.error("Invalid suggestion item:", item);
              alert("Could not add item to cart - item data missing.");
         }
     };

    if (loading) {
        return <p className="text-center mt-8 dark:text-gray-300">Loading your pantry...</p>;
    }
    // Handle error state even before checking for userInfo
    if (error) {
        return <p className="text-center mt-8 text-red-500">{error}</p>;
    }
     // If user is not logged in after loading, show login prompt
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo && !loading) {
         return (
              <div className="text-center mt-10">
                  <h2 className="text-2xl font-semibold dark:text-gray-100">Please Log In</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">You need to be logged in to manage your pantry.</p>
                  <Link to="/login" className="mt-4 inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
                      Go to Login
                  </Link>
              </div>
          );
    }


    return (
        <div className="max-w-6xl mx-auto mt-8 space-y-8 px-4"> {/* Added horizontal padding */}
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">My Pantry</h1>

            {/* Expiring Soon Section */}
            {expiringItems.length > 0 && (
                 <div className="bg-orange-100 dark:bg-orange-900/50 border-l-4 border-orange-500 p-4 rounded-md shadow">
                     <h2 className="text-xl font-semibold mb-3 text-orange-800 dark:text-orange-200">Expiring Soon! (Next 7 Days)</h2>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                         {expiringItems.map((pantryItem) => (
                            pantryItem.item && (
                                 <div key={pantryItem._id} className="bg-white dark:bg-gray-800 p-3 rounded shadow text-center flex flex-col items-center">
                                     <img src={pantryItem.item.imageUrl} alt={pantryItem.item.name} className="w-16 h-16 object-cover mb-2 rounded"/>
                                     <p className="text-sm font-medium dark:text-gray-200 flex-grow">{pantryItem.item.name}</p>
                                     <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                         Expires: {new Date(pantryItem.expiryDate).toLocaleDateString()}
                                     </p>
                                 </div>
                             )
                         ))}
                     </div>
                 </div>
            )}

            {/* Suggestions Section (Low Stock) */}
            {suggestions.length > 0 && (
                <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 p-4 rounded-md shadow">
                    <h2 className="text-xl font-semibold mb-3 text-yellow-800 dark:text-yellow-200">Refill Suggestions (Low Stock!)</h2>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {suggestions.map((pantryItem) => (
                           pantryItem.item && (
                                <div key={pantryItem._id} className="bg-white dark:bg-gray-800 p-3 rounded shadow text-center flex flex-col items-center">
                                    <img src={pantryItem.item.imageUrl} alt={pantryItem.item.name} className="w-16 h-16 object-cover mb-2 rounded"/>
                                    <p className="text-sm font-medium dark:text-gray-200 flex-grow">{pantryItem.item.name}</p>
                                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 mb-2">Only {pantryItem.quantity} left</p>
                                    <button
                                        onClick={() => handleAddSuggestionToCart(pantryItem)}
                                        className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 w-full mt-auto" // Added w-full and mt-auto
                                    > Add to Cart </button>
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
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">Your pantry is empty. Items you buy can be added here, or add them manually.</p>
                ) : (
                    <div className="space-y-4">
                        {pantryItems.map((pantryItem) => (
                           pantryItem.item && ( // Ensure item data exists before rendering row
                                <div key={pantryItem._id} className="flex flex-col md:flex-row justify-between items-center p-4 border dark:border-gray-700 rounded-lg gap-4">
                                    {/* Item Info */}
                                    <div className="flex items-center space-x-4 flex-grow w-full md:w-auto">
                                        <img src={pantryItem.item.imageUrl} alt={pantryItem.item.name} className="w-16 h-16 object-cover rounded flex-shrink-0" />
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-lg dark:text-gray-200">{pantryItem.item.name}</h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">{pantryItem.item.category}</p>
                                             {/* Display Expiry Date if set */}
                                             {pantryItem.expiryDate && (
                                                 <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                                     Expires: {new Date(pantryItem.expiryDate).toLocaleDateString()}
                                                 </p>
                                             )}
                                        </div>
                                    </div>

                                    {/* Expiry Date Input */}
                                    <div className="flex items-center space-x-2 w-full md:w-auto md:justify-center flex-shrink-0">
                                         <label htmlFor={`expiry-${pantryItem._id}`} className="text-sm dark:text-gray-300 flex-shrink-0">Expires:</label>
                                         <input
                                             type="date"
                                             id={`expiry-${pantryItem._id}`}
                                             value={formatDateForInput(pantryItem.expiryDate)}
                                             onChange={(e) => handleUpdateItem(pantryItem._id, { expiryDate: e.target.value || null })} // Send null if cleared
                                             className="px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm w-full md:w-auto"
                                             title="Set Expiry Date"
                                         />
                                     </div>

                                    {/* Quantity and Remove */}
                                    <div className="flex items-center space-x-3 flex-shrink-0 w-full md:w-auto justify-end">
                                        <button
                                            onClick={() => handleUpdateItem(pantryItem._id, { quantity: pantryItem.quantity - 1 })}
                                            disabled={pantryItem.quantity <= 0}
                                            className="bg-gray-300 dark:bg-gray-600 px-3 py-1 rounded disabled:opacity-50 text-lg font-bold"
                                            title="Decrease quantity"
                                        > - </button>
                                        <span className="font-semibold dark:text-gray-200 w-8 text-center">{pantryItem.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateItem(pantryItem._id, { quantity: pantryItem.quantity + 1 })}
                                            className="bg-gray-300 dark:bg-gray-600 px-3 py-1 rounded text-lg font-bold"
                                            title="Increase quantity"
                                        > + </button>
                                        <button
                                            onClick={() => handleRemoveItem(pantryItem._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 ml-4"
                                            title="Remove from Pantry"
                                        > Remove </button>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPantryPage;