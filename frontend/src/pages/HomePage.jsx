
// import React, { useState, useEffect } from 'react';
// import api from '../services/api';
// import ItemCard from '../components/ItemCard';
// import HeroBanner from '../components/HeroBanner';

// const HomePage = () => {
//     const [items, setItems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [keyword, setKeyword] = useState(''); // State for the search input

//     useEffect(() => {
//         const fetchItems = async () => {
//             try {
//                 setLoading(true);
//                 const { data } = await api.get(`/api/items?keyword=${keyword}`);
//                 setItems(data);
//             } catch (error) {
//                 console.error("Failed to fetch items", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         const timer = setTimeout(() => {
//             fetchItems();
//         }, 500);

//         return () => clearTimeout(timer);
        
//     }, [keyword]);

//     return (
//         <div>
//             <HeroBanner />

//             {/* Live Search Input Field */}
//             <div className="mb-8 max-w-2xl mx-auto">
//                 <input
//                     type="text"
//                     onChange={(e) => setKeyword(e.target.value)}
//                     value={keyword}
//                     placeholder="Search for products as you type..."
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
//                 />
//             </div>

//             <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Our Products</h2>
            
//             {loading ? (
//                  <p className="text-center mt-8 text-xl dark:text-gray-300">Loading...</p>
//             ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                     {items.length > 0 ? (
//                         items.map(item => <ItemCard key={item._id} item={item} />)
//                     ) : (
//                         <p className="col-span-full text-center text-gray-500 dark:text-gray-400 text-lg">
//                             No products found matching your search.
//                         </p>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default HomePage;
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; // Import Link for 'In Cart' button
// import api from '../services/api';
// import { useCart } from '../context/CartContext';
// import ItemCard from '../components/ItemCard'; // Make sure ItemCard is correctly imported
// import ImageSlider from '../components/ImageSlider'; // Import the ImageSlider component

// const HomePage = () => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchKeyword, setSearchKeyword] = useState('');
//   const { cart } = useCart(); // Get cart state to check if item is already added

//   // Images for the slider (Using Pexels URLs)
//   const sliderImages = [
//     'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Fresh Apples
//     'https://images.pexels.com/photos/3270054/pexels-photo-3270054.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Fresh Vegetables
//     'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Bread and Groceries
//     'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Milk and Dairy
//     'https://images.pexels.com/photos/13466256/pexels-photo-13466256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Yogurt and healthy food
//     'https://images.pexels.com/photos/4049876/pexels-photo-4049876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Shopping cart full of groceries
//   ];

//   useEffect(() => {
//     // Debounced item fetching logic
//     const fetchItems = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const { data } = await api.get(`/api/items?keyword=${searchKeyword}`);
//         setItems(data);
//       } catch (err) {
//         console.error('Error fetching items:', err);
//         setError('Failed to fetch products. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     const timer = setTimeout(() => {
//         fetchItems();
//     }, 500); // 500ms delay for search

//     return () => clearTimeout(timer); // Cleanup timer

//   }, [searchKeyword]); // Refetch when searchKeyword changes

//   const handleSearchChange = (e) => {
//     setSearchKeyword(e.target.value);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
//       {/* --- IMAGE SLIDER SECTION --- */}
//       <section className="mt-4 mb-8">
//         <ImageSlider images={sliderImages} interval={5000} /> {/* Use the ImageSlider */}
//       </section>
//       {/* --------------------------- */}

//       {/* Hero Section */}
//       <header className="text-center py-12 bg-green-600 dark:bg-gray-800 text-white rounded-lg shadow-lg mb-8">
//         <h1 className="text-5xl font-extrabold mb-4">Fresh Groceries, Delivered Fast</h1>
//         <p className="text-xl">The best products at the best prices, right at your doorstep.</p>
//       </header>

//       {/* Search Bar */}
//       <div className="max-w-xl mx-auto mb-8">
//         <input
//           type="text"
//           placeholder="Search for products as you type..."
//           className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
//           value={searchKeyword}
//           onChange={handleSearchChange}
//         />
//       </div>

//       {/* Products Section */}
//       <section className="py-8">
//         <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Our Products</h2>
//         {loading ? (
//           <p className="text-center dark:text-gray-300">Loading products...</p>
//         ) : error ? (
//           <p className="text-center text-red-500">{error}</p>
//         ) : items.length === 0 ? (
//           <p className="text-center text-gray-500 dark:text-gray-400">No products found matching your search.</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {items.map((item) => (
//               // Use the ItemCard component to display each item
//               <ItemCard key={item._id} item={item} />
//             ))}
//           </div>
//         )}
//       </section>
//     </div>
//   );
// };

// export default HomePage;

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
    'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Fresh Apples
    'https://images.pexels.com/photos/3270054/pexels-photo-3270054.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Fresh Vegetables
    'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Bread and Groceries
    'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Milk and Dairy
    'https://images.pexels.com/photos/13466256/pexels-photo-13466256.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Yogurt and healthy food
    'https://images.pexels.com/photos/4049876/pexels-photo-4049876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Shopping cart full of groceries
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
        <ImageSlider images={sliderImages} interval={5000} /> 
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
