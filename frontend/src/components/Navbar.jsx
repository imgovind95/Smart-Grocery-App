import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // Import useCart

const Navbar = () => {
  const navigate = useNavigate();
  const { cart, fetchCart, setCart } = useCart(); // Use cart state
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (userInfo) {
      fetchCart();
    }
  }, [userInfo?.token]); // Refetch cart when user logs in/out

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setCart(null); // Clear cart state on logout
    navigate('/login');
  };

  const cartItemCount = cart?.items?.length || 0;

  return (
    <nav className="bg-green-600 text-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="text-2xl font-bold">
            🛒 SmartCart
          </Link>
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                    </span>
                )}
            </Link>
            {userInfo ? (
              <>
                <span className="font-semibold hidden sm:block">Hello, {userInfo.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-green-200">Login</Link>
                <Link to="/signup" className="bg-white text-green-600 font-semibold px-3 py-1 rounded hover:bg-gray-100">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;