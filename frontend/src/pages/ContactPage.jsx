import React, { useState } from 'react';

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for your query! We will get back to you shortly.');
        // Clear the form
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Contact Us</h1>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                Have a question or need help? Fill out the form below.
            </p>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2">Your Query</label>
                    <textarea id="message" rows="5" value={message} onChange={(e) => setMessage(e.target.value)} required className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                </div>
                <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
                    Submit Query
                </button>
            </form>
        </div>
    );
};

export default ContactPage;