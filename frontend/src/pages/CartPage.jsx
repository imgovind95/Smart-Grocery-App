
import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const CartPage = () => {
    const { cart, loading, fetchCart, removeFromCart } = useCart();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (fetchCart) {
    //         fetchCart();
    //     }
    // }, [fetchCart]);

    const handleRemove = (itemId) => {
        removeFromCart(itemId);
    };

    const calculateTotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items
            .filter(cartItem => cartItem.item) // Safety filter
            .reduce((total, { item, quantity }) => total + item.price * quantity, 0)
            .toFixed(2);
    };

    const handlePlaceOrder = async () => {
        // This is the previous mock order function
        setIsPlacingOrder(true);
        try {
            await api.post('/api/orders');
            await fetchCart();
            navigate('/order-success');
        } catch (error) {
            console.error('Failed to place order', error);
            alert(error.response?.data?.message || 'Could not place your order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    if (loading) return <p className="text-center mt-8 dark:text-gray-300">Loading your cart...</p>;

    if (!cart || !cart.items || cart.items.filter(ci => ci.item).length === 0) {
        return (
            <div className="text-center mt-10">
                <h2 className="text-2xl font-semibold dark:text-gray-100">Your cart is empty</h2>
                <Link to="/" className="mt-4 inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
                    Go Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Your Shopping Cart</h1>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cart.items
                        .filter(cartItem => cartItem.item)
                        .map(({ item, quantity }) => (
                            <li key={item._id} className="flex items-center justify-between p-4">
                                <div className="flex items-center space-x-4">
                                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                                    <div className="dark:text-gray-200">
                                        <h3 className="text-lg font-semibold">{item.name}</h3>
                                        <p className="text-gray-500 dark:text-gray-400">Quantity: {quantity}</p>
                                        <p className="text-gray-700 dark:text-gray-300">Price: ₹{item.price}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemove(item._id)}
                                    className="text-red-500 hover:text-red-700 font-semibold"
                                >
                                    Remove
                                </button>
                            </li>
                    ))}
                </ul>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600 flex justify-between items-center">
                    <h2 className="text-xl font-bold dark:text-gray-100">Total Bill: ₹{calculateTotal()}</h2>
                    <button
                        onClick={handlePlaceOrder}
                        disabled={isPlacingOrder}
                        className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                    >
                        {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;