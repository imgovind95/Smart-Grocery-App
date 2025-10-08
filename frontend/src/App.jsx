
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // 1. Import the Footer
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CartPage from './pages/CartPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

function App() {
  return (
    // 2. Added flex classes to the main div for better layout
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto p-4 flex-grow"> {/* Added flex-grow */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer /> {/* 3. Add the Footer component here */}
    </div>
  );
}

export default App;