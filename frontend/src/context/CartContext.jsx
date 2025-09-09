import React, { createContext, useState, useContext } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/cart');
            setCart(data);
        } catch (error) {
            console.error('Failed to fetch cart', error);
            // If user is not logged in, cart will be null
            setCart(null); 
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (itemId, quantity = 1) => {
        try {
            const { data } = await api.post('/api/cart', { itemId, quantity });
            setCart(data);
        } catch (error) {
            console.error('Failed to add to cart', error);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const { data } = await api.delete(`/api/cart/item/${itemId}`);
            setCart(data);
        } catch (error) {
            console.error('Failed to remove from cart', error);
        }
    };

    const value = {
        cart,
        loading,
        fetchCart,
        addToCart,
        removeFromCart,
        setCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
