import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link
import api from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = React.useState(''); // Used React.useState for clarity
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));

      // Role-based redirect (if you implemented it earlier)
      if (data.role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Login</h2>
        {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</p>}
        
        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email</label>
          <input
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>
        
        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">Password</label>
          <input
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* --- FORGOT PASSWORD LINK --- */}
        <div className="text-right mb-4">
            <Link to="/forgot-password" className="text-sm text-green-500 hover:underline dark:text-green-400">
                Forgot Password?
            </Link>
        </div>
        {/* --------------------------- */}

        {/* Login Button */}
        <button 
          type="submit" 
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 cursor-pointer"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;