
// import { Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer'; // 1. Import the Footer
// import ContactPage from './pages/ContactPage';
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import SignupPage from './pages/SignupPage';
// import CartPage from './pages/CartPage';
// import OrderSuccessPage from './pages/OrderSuccessPage';

// function App() {
//   return (
//     // 2. Added flex classes to the main div for better layout
//     <div className="bg-gray-50 min-h-screen flex flex-col">
//       <Navbar />
//       <main className="container mx-auto p-4 flex-grow"> {/* Added flex-grow */}
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/signup" element={<SignupPage />} />
//           <Route path="/cart" element={<CartPage />} />
//           <Route path="/order-success" element={<OrderSuccessPage />} />
//           <Route path="/contact" element={<ContactPage />} />
//         </Routes>
//       </main>
//       <Footer /> {/* 3. Add the Footer component here */}
//     </div>
//   );
// }

// export default App;

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CartPage from './pages/CartPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ContactPage from './pages/ContactPage';
// 1. Import the new pages
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

function App() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto p-4 flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* 2. Add the new routes */}
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