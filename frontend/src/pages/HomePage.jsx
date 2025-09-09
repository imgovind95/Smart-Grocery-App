// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
// import api from '../services/api';
// import ItemCard from '../components/ItemCard';

// const HomePage = () => {
//     const [items, setItems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
    
//     // Check for user info in local storage
//     const userInfo = JSON.parse(localStorage.getItem('userInfo'));

//     useEffect(() => {
//         const fetchItems = async () => {
//             try {
//                 const { data } = await api.get('/api/items');
//                 setItems(data);
//             } catch (error) {
//                 console.error("Failed to fetch items", error);
//                 // If token is invalid/expired, the API will fail.
//                 // We can handle this by logging the user out.
//                 localStorage.removeItem('userInfo');
//                 navigate('/login');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (userInfo) {
//             fetchItems();
//         } else {
//             // If no user, no need to fetch. Just stop loading.
//             setLoading(false);
//         }
//     }, [userInfo?.token, navigate]); // Rerun effect if token changes or navigate function is available

//     // If there is no user, show a welcome screen
//     if (!userInfo) {
//         return (
//             <div className="text-center mt-20 p-6">
//                 <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to SmartCart! 🛒</h1>
//                 <p className="text-lg text-gray-600 mb-8">
//                     Please log in to browse our selection of fresh groceries.
//                 </p>
//                 <div className="space-x-4">
//                     <Link 
//                         to="/login" 
//                         className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105"
//                     >
//                         Login
//                     </Link>
//                     <Link 
//                         to="/signup" 
//                         className="bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 transition-transform transform hover:scale-105"
//                     >
//                         Sign Up
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     // If the user is logged in, show the items
//     if (loading) {
//         return <p className="text-center mt-8">Loading items...</p>;
//     }

//     return (
//         <div>
//             <h1 className="text-3xl font-bold mb-6">Groceries For You</h1>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {items.length > 0 ? (
//                     items.map(item => <ItemCard key={item._id} item={item} />)
//                 ) : (
//                     <p>No items available at the moment.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default HomePage;

// import React, { useState, useEffect } from 'react';
// import api from '../services/api';
// import ItemCard from '../components/ItemCard';
// import HeroBanner from '../components/HeroBanner'; // Import the new banner

// const HomePage = () => {
//     const [items, setItems] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // This function will now run for all users
//         const fetchItems = async () => {
//             try {
//                 setLoading(true);
//                 const { data } = await api.get('/api/items');
//                 setItems(data);
//             } catch (error) {
//                 console.error("Failed to fetch items", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchItems();
//     }, []); // Empty dependency array means it runs once on mount

//     if (loading) {
//         return <p className="text-center mt-8 text-xl">Loading delicious groceries...</p>;
//     }

//     return (
//         <div>
//             {/* Add the Hero Banner at the top */}
//             <HeroBanner />

//             <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Products</h2>
            
//             {/* The grid of items is now always visible */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {items.length > 0 ? (
//                     items.map(item => <ItemCard key={item._id} item={item} />)
//                 ) : (
//                     <p>No items available at the moment.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default HomePage;

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ItemCard from '../components/ItemCard';
import HeroBanner from '../components/HeroBanner';

const HomePage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState(''); // State for the search input

    useEffect(() => {
        // This useEffect hook will now handle the debounced search
        const fetchItems = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/api/items?keyword=${keyword}`);
                setItems(data);
            } catch (error) {
                console.error("Failed to fetch items", error);
            } finally {
                setLoading(false);
            }
        };

        // Set a timer to wait for the user to stop typing
        const timer = setTimeout(() => {
            fetchItems();
        }, 500); // 500ms = half a second delay

        // This is a cleanup function that clears the timer if the user types again
        return () => clearTimeout(timer);
        
    }, [keyword]); // The effect re-runs every time the 'keyword' changes

    return (
        <div>
            <HeroBanner />

            {/* Live Search Input Field */}
            <div className="mb-8 max-w-2xl mx-auto">
                <input
                    type="text"
                    onChange={(e) => setKeyword(e.target.value)}
                    value={keyword}
                    placeholder="Search for products as you type..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>

            <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Products</h2>
            
            {loading ? (
                 <p className="text-center mt-8 text-xl">Loading...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.length > 0 ? (
                        items.map(item => <ItemCard key={item._id} item={item} />)
                    ) : (
                        <p className="col-span-full text-center text-gray-500 text-lg">
                            No products found matching your search.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default HomePage;