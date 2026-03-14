import Headers from './components/Header';
import Footer from './components/footer';
import './App.css';
import Home from './pages/Home';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ProductDetail from './pages/productDetail';
import { useState } from 'react';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cart from './pages/Cart';
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import AdminRoute from './components/AdminRoute';
import AdminUsers from './pages/AdminUsers';
import AdminProducts from './pages/AdminProducts';
import ProtectedRoute from './components/ProtectedRoute';

import AnimatedPage from './components/AnimatedPage';
import { AnimatePresence } from 'framer-motion';

function AppContent() {
  const [cartItems, setCartItems] = useState([]);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="main-app">
      <ToastContainer theme='dark' position='top-center' />
      
      {!isAdminRoute && <Headers cartItems={cartItems} />}
      
      <main className="main-container">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/search" element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/product/:id" element={<AnimatedPage><ProductDetail cartItems={cartItems} setCartItems={setCartItems} /></AnimatedPage>} />
            <Route path="/cart" element={<AnimatedPage><Cart cartItems={cartItems} setCartItems={setCartItems} /></AnimatedPage>} />
            <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
            <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />

            {/* Protected User Routes */}
            <Route path="/user/dashboard" element={
              <ProtectedRoute>
                <AnimatedPage><UserDashboard /></AnimatedPage>
              </ProtectedRoute>
            } />

            <Route path="/admin/products" element={
              <ProtectedRoute>
                <AdminRoute>
                  <AnimatedPage><AdminProducts /></AnimatedPage>
                </AdminRoute>
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminRoute>
                  <AnimatedPage><AdminDashboard /></AnimatedPage>
                </AdminRoute>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <AdminRoute>
                  <AnimatedPage><AdminUsers /></AnimatedPage>
                </AdminRoute>
              </ProtectedRoute>
            } />
          </Routes>
        </AnimatePresence>
      </main>
      
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
