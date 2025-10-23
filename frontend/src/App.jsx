import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CartPage from './pages/CartPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import SellerDashboardPage from './pages/SellerDashboardPage'; // Seller Dashboard ko import karein

function App() {
  const { fetchCart } = useCart();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // Yeh useEffect ab check karega ki user logged-in hai AUR 'buyer' hai
  useEffect(() => {
    if (userInfo && userInfo.role === 'buyer') {
      fetchCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo?.token]); // Jab bhi login state change ho, yeh run hoga

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto p-4 flex-grow">
        <Routes>
          {/* Buyer Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Seller Route */}
          <Route path="/seller/dashboard" element={<SellerDashboardPage />} />

          {/* Footer Page Routes */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;