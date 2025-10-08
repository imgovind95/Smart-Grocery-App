import React from 'react';

const PrivacyPolicyPage = () => {
    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Privacy Policy</h1>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>Your privacy is important to us. It is SmartCart's policy to respect your privacy regarding any information we may collect from you across our website.</p>
                <h2 className="text-2xl font-semibold pt-4">1. Information We Collect</h2>
                <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
                <h2 className="text-2xl font-semibold pt-4">2. Use of Information</h2>
                <p>We use the information we collect to operate, maintain, and provide you with the features and functionality of the service, as well as to communicate directly with you, such as to send you email messages and push notifications.</p>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;