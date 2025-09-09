import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  return (
    <div className="text-center mt-20 p-8 bg-white shadow-lg rounded-lg max-w-lg mx-auto">
      <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h1 className="text-3xl font-bold mt-4 text-gray-800">Order Placed Successfully!</h1>
      <p className="text-md text-gray-600 mt-2">
        Thank you for your purchase. Your items will be on their way shortly.
      </p>
      <div className="mt-8">
        <Link
          to="/"
          className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;