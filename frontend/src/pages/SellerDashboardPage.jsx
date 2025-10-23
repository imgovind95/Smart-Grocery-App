import React, { useState, useEffect } from 'react';
import api from '../services/api';

// Stats card component (ismein koi change nahi)
const StatCard = ({ title, value }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">{title}</h3>
        <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
    </div>
);

const SellerDashboardPage = () => {
    const [myItems, setMyItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    
    // Form state
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [countInStock, setCountInStock] = useState(0); 
    
    const [editingItemId, setEditingItemId] = useState(null);

    const fetchMyItems = async () => {
        try {
            const { data } = await api.get('/api/items/my-items');
            setMyItems(data);
        } catch (error) {
            console.error('Failed to fetch items', error);
        }
    };

    const fetchSellerStats = async () => {
        try {
            const { data } = await api.get('/api/seller/stats');
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    };

    // --- YAHAN BADLAAV KIYA GAYA HAI ---
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true); // Loading shuru karein
                await Promise.all([fetchMyItems(), fetchSellerStats()]);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
                // Agar zaroori ho toh user ko error dikhayein
                // alert("Could not load dashboard data. Please refresh.");
            } finally {
                // Yeh block hamesha chalega (chaahe error aaye ya na aaye)
                setLoading(false); // Loading state ko false set karein
            }
        };
        loadDashboardData();
    }, []); // Yeh effect ek hi baar chalega

    const resetForm = () => {
        setName('');
        setCategory('');
        setPrice('');
        setImageUrl('');
        setCountInStock(0);
        setEditingItemId(null);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const itemData = { name, category, price, imageUrl, countInStock };
        try {
            if (editingItemId) {
                await api.put(`/api/items/${editingItemId}`, itemData);
                alert('Item updated successfully!');
            } else {
                await api.post('/api/items', itemData);
                alert('Item added successfully!');
            }
            resetForm();
            // Data ko dobara fetch karein
            await fetchMyItems(); 
            await fetchSellerStats(); 
        } catch (error) {
            console.error('Failed to submit item', error);
            alert('Error submitting item. Please try again.');
        }
    };

    const handleEditSelect = (item) => {
        setName(item.name);
        setCategory(item.category);
        setPrice(item.price);
        setImageUrl(item.imageUrl);
        setCountInStock(item.countInStock || 0); // Agar stock null hai toh 0 set karein
        setEditingItemId(item._D);
    };

    const handleDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`/api/items/${itemId}`);
                alert('Item deleted successfully!');
                await fetchMyItems(); 
                await fetchSellerStats();
            } catch (error) {
                console.error('Failed to delete item', error);
                alert('Error deleting item.');
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto mt-8 space-y-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Seller Dashboard</h1>
            
            {/* --- Sales Stats Section --- */}
            {loading ? (
                <p className="dark:text-gray-300">Loading stats...</p>
            ) : stats ? ( // Check karein ki stats null toh nahi hain
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toFixed(2)}`} />
                    <StatCard title="Total Items Sold" value={stats.totalItemsSold} />
                    <StatCard title="Total Customers" value={stats.totalCustomers} />
                </div>
            ) : (
                <p className="dark:text-gray-400">Could not load stats. Please refresh.</p> // Error message
            )}
            
            {/* --- Item Management Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 1. Add / Edit Form */}
                <div className="md:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                            {editingItemId ? 'Edit Your Item' : 'Add a New Item'}
                        </h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">Item Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">Category</label>
                                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">Price (₹)</label>
                                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">Stock Quantity</label>
                                <input 
                                    type="number" 
                                    value={countInStock} 
                                    onChange={(e) => setCountInStock(e.target.value)} 
                                    required 
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">Photo URL</label>
                                <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            
                            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
                                {editingItemId ? 'Update Item' : 'Upload Item'}
                            </button>
                            {editingItemId && (
                                <button type="button" onClick={resetForm} className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 mt-2">
                                    Cancel Edit
                                </button>
                            )}
                        </form>
                    </div>
                </div>

                {/* 2. My Items List */}
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Your Listed Items</h2>
                        {loading ? (
                            <p className="dark:text-gray-300">Loading your items...</p>
                        ) : (
                            <div className="space-y-4">
                                {myItems.length === 0 ? (
                                    <p className="dark:text-gray-400">You have not listed any items yet.</p>
                                ) : (
                                    myItems.map(item => (
                                        <div key={item._id} className="flex justify-between items-center p-4 border dark:border-gray-700 rounded-lg">
                                            <div className="flex items-center space-x-4">
                                                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                                <div>
                                                    <h3 className="font-semibold text-lg dark:text-gray-200">{item.name}</h3>
                                                    <p className="text-gray-500 dark:text-gray-400">{item.category}</p>
                                                    {item.countInStock > 0 ? (
                                                        <p className="text-sm text-green-500">In Stock: {item.countInStock}</p>
                                                    ) : (
                                                        <p className="text-sm font-bold text-red-500">OUT OF STOCK</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <p className="font-bold text-lg dark:text-gray-200">₹{item.price}</p>
                                                <button onClick={() => handleEditSelect(item)} className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600">Edit</button>
                                                <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600">Delete</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboardPage;