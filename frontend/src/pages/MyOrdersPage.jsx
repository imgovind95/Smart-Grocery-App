import React, { useState, useEffect } from 'react';
import api from '../services/api';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); // State to hold potential error message

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError(''); // Reset error on new fetch
                const { data } = await api.get('/api/orders/myorders');
                setOrders(data);
            } catch (err) {
                console.error("Failed to fetch orders", err);
                setError(err.response?.data?.message || 'Could not fetch your orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return <p className="text-center mt-8 dark:text-gray-300">Loading your orders...</p>;
    }

    if (error) {
         return <p className="text-center mt-8 text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">My Order History</h1>
            {orders.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">You haven't placed any orders yet.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 border-b dark:border-gray-700 pb-2 gap-2">
                                <div>
                                    <h2 className="text-lg font-semibold dark:text-gray-200 break-all">Order ID: {order._id}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Placed on: {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <p className="text-lg font-bold dark:text-gray-100 flex-shrink-0">Total: ₹{order.totalPrice.toFixed(2)}</p>
                            </div>
                            <h3 className="text-md font-semibold mb-2 dark:text-gray-300">Items:</h3>
                            <ul className="space-y-3">
                                {order.orderItems.map((item, index) => ( // Use index for key if item.item is missing (though it shouldn't be)
                                    <li key={item.item || index} className="flex items-center space-x-3 text-sm dark:text-gray-400">
                                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded flex-shrink-0"/>
                                        <span className="flex-grow">{item.name} (Qty: {item.quantity}) - ₹{item.price.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;