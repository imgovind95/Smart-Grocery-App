import React from 'react';

const AboutPage = () => {
    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">About SmartCart 🛒</h1>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                    Welcome to SmartCart, your number one source for all things grocery. We're dedicated to giving you the very best of products, with a focus on quality, fast delivery, and customer service.
                </p>
                <p>
                    Founded in 2025, SmartCart has come a long way from its beginnings. When we first started out, our passion for providing fresh and affordable groceries drove us to build a platform that can serve customers right at their doorstep. We now serve customers all over the city and are thrilled that we're able to turn our passion into our own website.
                </p>
                <p>
                    We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
                </p>
            </div>
        </div>
    );
};

export default AboutPage;