import React, { useState } from 'react'; // Import useState
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ItemCard = ({ item }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false); // State for visual feedback

  const handleAddToCart = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
    } else {
      addToCart(item._id);
      // Provide visual feedback instead of an alert
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500); // Reset button after 1.5 seconds
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col justify-between">
      <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-500">{item.category}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-green-600">₹{item.price}</span>
          <button 
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`px-4 py-2 rounded-lg font-semibold text-white transition-colors duration-300 ${
              isAdded 
                ? 'bg-indigo-500 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isAdded ? 'Added! ✔' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;