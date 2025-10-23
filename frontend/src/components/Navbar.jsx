import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { cart, fetchCart, setCart } = useCart();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > 200 && window.scrollY > lastScrollY) setIsVisible(false);
      else setIsVisible(true);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  useEffect(() => {
    if (userInfo && userInfo.role === 'buyer') fetchCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.token]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setCart(null);
    navigate('/login');
  };

  const cartItemCount = cart?.items?.filter(ci => ci.item).length || 0;

  return (
    <nav 
      className={`bg-green-600 dark:bg-gray-800 text-white shadow-md sticky top-0 z-10 dark:border-b dark:border-gray-700 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="text-2xl font-bold">🛒 SmartCart</Link>
          <div className="flex items-center space-x-4 md:space-x-6">
            {userInfo ? (
              <>
                {userInfo.role === 'seller' ? (
                  <Link to="/seller/dashboard" className="font-semibold hover:text-green-200 dark:hover:text-gray-300">Dashboard</Link>
                ) : (
                  <>
                    {/* --- "MY ORDERS" LINK ADD KIYA GAYA HAI --- */}
                    <Link to="/my-orders" className="font-semibold hover:text-green-200 dark:hover:text-gray-300 hidden md:block">
                      My Orders
                    </Link>
                    {/* ------------------------------------------- */}
                    <Link to="/cart" className="relative">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
                      )}
                    </Link>
                  </>
                )}
                <span className="font-semibold hidden sm:block">Hello, {userInfo.name}</span>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-green-200 dark:hover:text-gray-300">Login</Link>
                <Link to="/signup" className="bg-white text-green-600 font-semibold px-3 py-1 rounded hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;