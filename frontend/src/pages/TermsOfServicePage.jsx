import React from 'react';

const TermsOfServicePage = () => {
    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">Terms of Service</h1>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <h2 className="text-2xl font-semibold pt-4">1. Terms</h2>
                <p>By accessing the website at SmartCart, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
                <h2 className="text-2xl font-semibold pt-4">2. Use License</h2>
                <p>Permission is granted to temporarily download one copy of the materials (information or software) on SmartCart's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
            </div>
        </div>
    );
};

export default TermsOfServicePage;