import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { AppProvider } from './context/AppContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLayout from './components/admin/AdminLayout';
import AdminRoute from './components/admin/AdminRoute';

// Public Pages
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import CakeDetailPage from './pages/CakeDetailPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import CakeManagement from './pages/admin/CakeManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import SlideshowManagement from './pages/admin/SlideshowManagement';
import EnquiryManagement from './pages/admin/EnquiryManagement';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="cakes" element={<CakeManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="slideshow" element={<SlideshowManagement />} />
              <Route path="enquiries" element={<EnquiryManagement />} />
            </Route>

            {/* Public Routes */}
            <Route path="/*" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/category/:category" element={<CategoryPage />} />
                    <Route path="/cake/:id" element={<CakeDetailPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;