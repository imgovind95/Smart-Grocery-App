import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">🛒 SmartCart</h2>
        <p className="mb-4 text-gray-400">Your one-stop shop for fresh groceries, delivered fast.</p>
        <div className="flex justify-center space-x-6 mb-4">
          <a href="#" className="hover:text-green-400">About Us</a>
          {/* <a href="#" className="hover:text-green-400">Contact</a> */}
          // Change this line in the div with other links
          <a href="/contact" className="hover:text-green-400">Contact</a>
          <a href="#" className="hover:text-green-400">Privacy Policy</a>
          <a href="#" className="hover:text-green-400">Terms of Service</a>
        </div>
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} SmartCart. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;