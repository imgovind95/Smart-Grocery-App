import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                setError('');
                const { data } = await api.get('/api/users/profile');
                setUser(data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
                setError(err.response?.data?.message || 'Could not load your profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return <p className="text-center mt-8 dark:text-gray-300">Loading profile...</p>;
    }

    if (error) {
        return <p className="text-center mt-8 text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">My Profile</h1>
            {user ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                        <p className="mt-1 text-lg text-gray-900 dark:text-white">{user.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                        <p className="mt-1 text-lg text-gray-900 dark:text-white">{user.email}</p>
                    </div>
                    {/* Yahaan aap future mein Address bhi dikha sakte hain */}
                </div>
            ) : (
                <p className="text-center dark:text-gray-400">Could not load profile details.</p>
            )}
            {/* Future mein yahaan "Edit Profile" ka button add kar sakte hain */}
        </div>
    );
};

export default ProfilePage;