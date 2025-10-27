import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

// Accept isScrolling prop
const ItemCard = ({ item, isScrolling }) => {
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isAddingToPantry, setIsAddingToPantry] = useState(false);

  const inStock = item.countInStock > 0;
  const isItemInCart = cart?.items?.some(cartItem => cartItem.item && cartItem.item._id === item._id);

  // Find Cheapest Vendor Price
  let cheapestVendor = null;
  if (item.vendors && item.vendors.length > 0) {
    cheapestVendor = item.vendors.reduce((min, vendor) => vendor.price < min.price ? vendor : min, item.vendors[0]);
  }

  const handleAddToCart = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
    } else {
      addToCart(item._id);
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 1500);
    }
  };

  const handleAddToPantry = async () => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
          navigate('/login');
          return;
      }
      setIsAddingToPantry(true);
      try {
          await api.post('/api/pantry/add', { itemId: item._id, quantity: 1 });
          alert(`${item.name} added to your pantry!`);
      } catch (error) {
           console.error("Failed to add to pantry", error);
           alert(error.response?.data?.message || 'Could not add item to pantry.');
      } finally {
          setIsAddingToPantry(false);
      }
  };

  return (
    // Apply hover scale effect only if isScrolling is false
    <div className={`bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg overflow-hidden flex flex-col justify-between transform transition-transform duration-300 ${
        !isScrolling ? 'hover:scale-105' : ''
      }`}
    >
      <div className="relative">
        <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
        {!inStock && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                OUT OF STOCK
            </div>
        )}
      </div>

      <div className="p-4 flex-grow">
        <h3 className="text-xl font-semibold mb-2 dark:text-gray-200">{item.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{item.category}</p>

        {/* Price Display */}
        <div className="mb-4">
             <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                 ₹{item.price.toFixed(2)}
                 <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">(on SmartCart)</span>
             </p>
             {cheapestVendor && cheapestVendor.price < item.price && (
                 <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                     Cheapest at {cheapestVendor.storeName}: ₹{cheapestVendor.price.toFixed(2)}
                 </p>
             )}
              {cheapestVendor && cheapestVendor.price >= item.price && !cheapestVendor.price < item.price && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      (Best price here!)
                  </p>
             )}
        </div>

        {/* Stock Status */}
        {item.countInStock > 0 ? (
          <p className="text-sm text-green-500 dark:text-green-400">In Stock: {item.countInStock}</p>
        ) : (
          <p className="text-sm font-bold text-red-500">OUT OF STOCK</p>
        )}
      </div>

      {/* Buttons Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
         {/* Add to Cart Button */}
         {isItemInCart ? (
             <Link to="/cart" className="w-full block text-center bg-gray-400 dark:bg-gray-600 text-white py-2 px-4 rounded-lg cursor-not-allowed">
               In Cart
             </Link>
         ) : (
             <button
                 onClick={handleAddToCart}
                 disabled={!inStock || isAddedToCart}
                 className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-colors duration-300 cursor-pointer ${
                 !inStock ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                 : isAddedToCart ? 'bg-indigo-500 cursor-not-allowed'
                 : 'bg-green-500 hover:bg-green-600'
                 }`}
             >
                 {isAddedToCart ? 'Added! ✔' : (inStock ? 'Add to Cart' : 'Out of Stock')}
             </button>
         )}

         {/* Add to Pantry Button */}
         <button
            onClick={handleAddToPantry}
            disabled={isAddingToPantry}
            className={`w-full py-2 px-4 rounded-lg font-semibold text-sm transition-colors duration-300 cursor-pointer ${
                isAddingToPantry
                ? 'bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            title="Add this item to your home pantry tracker"
         >
            {isAddingToPantry ? 'Adding...' : 'Add to Pantry'}
         </button>
      </div>
    </div>
  );
};

export default ItemCard;