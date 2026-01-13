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
import UserDashboard from './pages/UserDashboard'; // Create this too
import AdminRoute from './components/AdminRoute';
import AdminUsers from './pages/AdminUsers'; // New admin users management page
import AdminProducts from './pages/AdminProducts'; // New admin products management page

import ProtectedRoute from './components/ProtectedRoute'; // Your existing

function AppContent() {
  const [cartItems, setCartItems] = useState([]);
  const location = useLocation();
  
  // Check if current path is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      <ToastContainer theme='dark' position='top-center' />
      
      {/* Only show Header on non-admin routes */}
      {!isAdminRoute && <Headers cartItems={cartItems} />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected User Routes */}
        <Route path="/user/dashboard" element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin/products" element={
  <ProtectedRoute>
    <AdminRoute>
      <AdminProducts />
    </AdminRoute>
  </ProtectedRoute>
} />

        
        {/* Admin Routes - Double Protection */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </ProtectedRoute>
        } />
        
        {/* More admin routes */}
        <Route path="/admin/users" element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          </ProtectedRoute>
        } />
      </Routes>
      
      {/* Only show Footer on non-admin routes */}
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
