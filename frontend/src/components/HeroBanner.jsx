import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    return (
        <div 
            className="relative bg-cover bg-center rounded-lg overflow-hidden mb-8 h-80" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80')" }}
        >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white p-4">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Fresh Groceries, Delivered Fast</h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl">The best products at the best prices, right at your doorstep.</p>
                
                {/* Show Login/Signup buttons only if user is not logged in */}
                {!userInfo && (
                    <div className="mt-8 space-x-4">
                        <Link to="/login" className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105">
                            Login
                        </Link>
                        <Link to="/signup" className="bg-white text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeroBanner;