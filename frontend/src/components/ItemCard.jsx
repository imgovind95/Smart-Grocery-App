import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ItemCard = ({ item }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);
  
  // Naya check: Kya item stock mein hai?
  const inStock = item.countInStock > 0;

  const handleAddToCart = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
    } else {
      addToCart(item._id);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm overflow-hidden flex flex-col justify-between">
      <div className="relative">
        <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
        {/* --- NAYA "OUT OF STOCK" BADGE --- */}
        {!inStock && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                OUT OF STOCK
            </div>
        )}
        {/* ---------------------------------- */}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{item.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-green-600">₹{item.price}</span>
          
          {/* --- "ADD TO CART" BUTTON LOGIC UPDATE --- */}
          <button 
            onClick={handleAddToCart}
            disabled={!inStock || isAdded} // Agar stock nahi hai toh disable karein
            className={`px-4 py-2 rounded-lg font-semibold text-white transition-colors duration-300 ${
              !inStock
                ? 'bg-gray-400 cursor-not-allowed' // Disabled style
                : isAdded 
                ? 'bg-indigo-500 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isAdded ? 'Added! ✔' : (inStock ? 'Add to Cart' : 'Out of Stock')}
          </button>
          {/* --------------------------------------- */}

        </div>
      </div>
    </div>
  );
};

export default ItemCard;