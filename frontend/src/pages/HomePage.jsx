import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import ItemCard from '../components/ItemCard'; // ItemCard ko import karein
import ImageSlider from '../components/ImageSlider'; // ImageSlider ko import karein

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const { cart } = useCart();

  // Slider ke liye images
  const sliderImages = [
    'https://images.pexels.com/photos/672101/pexels-photo-672101.jpeg', // Fresh Apples
    'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg', // Fresh Vegetables
    'https://images.pexels.com/photos/30688912/pexels-photo-30688912.jpeg', // Bread and Groceries
    'https://images.pexels.com/photos/7881123/pexels-photo-7881123.jpeg', // Milk and Dairy
    'https://images.pexels.com/photos/7937045/pexels-photo-7937045.jpeg', // Yogurt and healthy food
    'https://images.pexels.com/photos/8939307/pexels-photo-8939307.jpeg', // Shopping cart full of groceries
  ];

  useEffect(() => {
    // Debounced item fetching logic
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get(`/api/items?keyword=${searchKeyword}`);
        setItems(data);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
        fetchItems();
    }, 500); // 500ms delay for search

    return () => clearTimeout(timer); // Cleanup timer

  }, [searchKeyword]); // Refetch when searchKeyword changes

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
      {/* --- IMAGE SLIDER SECTION --- */}
      {/* Yahaan ImageSlider ko bina 'heroContent' prop ke call kiya gaya hai */}
      <section className="mt-4 mb-8">
        <ImageSlider images={sliderImages} interval={2800} /> 
      </section>
      {/* --------------------------- */}

      {/* --- HERO SECTION (ALAG SE) --- */}
      {/* Yeh section ab wapas aa gaya hai */}
      <header className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-8">
        <h1 className="text-5xl font-extrabold mb-4 text-gray-900 dark:text-white">Fresh Groceries, Delivered Fast</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">The best products at the best prices, right at your doorstep.</p>
      </header>
      {/* -------------------------- */}

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search for products as you type..."
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchKeyword}
          onChange={handleSearchChange}
        />
      </div>

      {/* Products Section */}
      <section className="py-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Our Products</h2>
        {loading ? (
          <p className="text-center dark:text-gray-300">Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No products found matching your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
