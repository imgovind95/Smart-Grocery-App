import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { cart, fetchCart, setCart } = useCart();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for hamburger menu

  // Scroll effect
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > 200 && window.scrollY > lastScrollY) setIsVisible(false);
      else setIsVisible(true);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // Fetch cart effect
  useEffect(() => {
    if (userInfo && userInfo.role === 'buyer') fetchCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.token]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setCart(null);
    setIsMobileMenuOpen(false); // Close menu on logout
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const cartItemCount = cart?.items?.filter(ci => ci.item).length || 0;

  // Render common links AND Logout button/link for the dropdown
  const renderNavLinks = () => (
    <>
      <Link
        to="/recipes"
        className="block px-4 py-2 hover:bg-gray-700 rounded"
        onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
      >
        Recipes
      </Link>
      {userInfo && userInfo.role === 'buyer' && (
        <>
          <Link
            to="/my-pantry"
            className="block px-4 py-2 hover:bg-gray-700 rounded"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            My Pantry
          </Link>
          <Link
            to="/my-orders"
            className="block px-4 py-2 hover:bg-gray-700 rounded"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            My Orders
          </Link>
        </>
      )}
      {userInfo && userInfo.role === 'seller' && (
          <Link
              to="/seller/dashboard"
              className="block px-4 py-2 hover:bg-gray-700 rounded"
              onClick={() => setIsMobileMenuOpen(false)}
          >
              Dashboard
          </Link>
      )}
       {userInfo && (
           <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-700 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
            >
                Profile
            </Link>
       )}
       {userInfo && (
           <button
             onClick={handleLogout}
             className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 rounded"
           >
             Logout
           </button>
       )}
    </>
  );

  return (
    // Added relative positioning to the nav for absolute positioning of the dropdown
    <nav
      className={`relative bg-green-600 dark:bg-gray-800 text-white shadow-md sticky top-0 z-50 dark:border-b dark:border-gray-700 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex-shrink-0">🛒 SmartCart</Link>

          {/* Desktop Menu Removed */}

          {/* Right Side Icons/Buttons */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {userInfo ? (
              // Logged In User - Cart & Name always visible
              <>
                {userInfo.role === 'buyer' && (
                  <Link to="/cart" className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
                    )}
                  </Link>
                )}
                <span className="font-semibold hidden sm:block">Hello, {userInfo.name}</span>
              </>
            ) : (
              // Logged Out User - Login/Signup always visible
              <>
                <Link to="/login" className="hover:text-green-200 dark:hover:text-gray-300">Login</Link>
                <Link to="/signup" className="bg-white text-green-600 font-semibold px-3 py-1 rounded hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">Sign Up</Link>
              </>
            )}

            {/* Hamburger Button - Always Visible */}
             <button
                  onClick={toggleMobileMenu}
                  // Removed md:hidden
                  className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  aria-label="Toggle menu"
                >
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> // Close icon
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /> // Hamburger icon
                    )}
                  </svg>
                </button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu - Narrow and Positioned */}
      {/* Removed md:hidden */}
      {isMobileMenuOpen && (
        <div className="absolute top-full right-4 w-64 mt-2 bg-green-700 dark:bg-gray-800 border border-green-800 dark:border-gray-700 rounded-md shadow-lg py-2 z-50">
          <div className="px-2 space-y-1">
            {renderNavLinks()}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;