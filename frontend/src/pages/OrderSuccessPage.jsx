import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Import api

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order; // Get order details passed from CartPage
  const [isAddingToPantry, setIsAddingToPantry] = useState(false);

  const handleAddOrderToPantry = async () => {
      if (!order || !order.orderItems || order.orderItems.length === 0) {
          alert("Order details not found or order is empty.");
          return;
      }

      setIsAddingToPantry(true);
      let successCount = 0;
      let errorCount = 0;

      try {
          // Add each item from the order to the pantry
          for (const orderItem of order.orderItems) {
              try {
                  if (orderItem.item && orderItem.item._id) {
                      await api.post('/api/pantry/add', {
                          itemId: orderItem.item._id,
                          quantity: orderItem.quantity
                      });
                      successCount++;
                  } else {
                       console.warn("Skipping item with missing ID in order:", orderItem);
                       errorCount++;
                  }
              } catch (pantryError) {
                   console.error(`Failed to add ${orderItem.name} to pantry:`, pantryError);
                   errorCount++;
              }
          }

          if (errorCount > 0) {
               alert(`${successCount} item(s) added to pantry. ${errorCount} item(s) failed (possibly already exist or error occurred).`);
          } else {
               alert('All ordered items added to your pantry!');
          }
          navigate('/my-pantry'); // Navigate to pantry page after adding

      } catch (error) {
           console.error("General error adding order to pantry:", error);
           alert("An error occurred while trying to add items to pantry.");
      } finally {
           setIsAddingToPantry(false);
      }
  };


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
        {/* Checkmark Icon */}
        <div className="text-green-500 mb-6">
          <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">Order Placed Successfully!</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Thank you for your purchase. Your items will be on their way shortly.
        </p>

        {/* Add Order to Pantry Button */}
        {order && order.orderItems && order.orderItems.length > 0 && (
             <button
                 onClick={handleAddOrderToPantry}
                 disabled={isAddingToPantry}
                 className={`w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors mb-4 ${isAddingToPantry && 'opacity-50 cursor-not-allowed'}`}
             >
                 {isAddingToPantry ? 'Adding to Pantry...' : 'Add Ordered Items to My Pantry'}
             </button>
        )}

        <Link to="/" className="w-full block bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;