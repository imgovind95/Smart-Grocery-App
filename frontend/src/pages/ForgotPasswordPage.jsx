import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(''); // To show success/error messages
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            // Call the backend API to request password reset
            const { data } = await api.post('/api/auth/forgot-password', { email });
            setMessage(data.message || 'Password reset email sent successfully! Please check your inbox (and spam folder).');
            setEmail(''); // Clear email field on success
        } catch (err) {
            console.error("Forgot Password Error:", err);
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Forgot Password</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                    Enter the email address associated with your account, and we'll send you a link to reset your password.
                </p>

                {/* Display Success or Error Messages */}
                {message && <p className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">{message}</p>}
                {error && <p className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</p>}

                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required
                        placeholder="your.email@example.com"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 cursor-pointer" // cursor-pointer added here
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <div className="text-center mt-4">
                    <Link to="/login" className="text-sm text-green-500 hover:underline dark:text-green-400">
                        Back to Login
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordPage;