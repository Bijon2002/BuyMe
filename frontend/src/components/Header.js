import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Search from "./Search";

export default function Header({ cartItems }) {
  const [settings, setSettings] = useState({ shopName: 'BuyMe', logo: '/images/logo.png' });
  const { scrollY } = useScroll();

  // Scroll animations
  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(115, 21, 46, 1)", "rgba(115, 21, 46, 0.9)"]
  );
  
  const headerPadding = useTransform(
    scrollY,
    [0, 100],
    ["1rem 2rem", "0.5rem 2rem"]
  );

  const headerShadow = useTransform(
    scrollY,
    [0, 100],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 10px 30px rgba(0,0,0,0.15)"]
  );

  useEffect(() => {
    fetch((process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1") + '/settings')
      .then(res => {
        if (!res.ok) throw new Error("Settings endpoint not found");
        return res.json();
      })
      .then(res => {
        if (res.success) setSettings(res.settings);
      })
      .catch(err => console.warn('Header settings fetch fallback:', err.message));
  }, []);

  const logoSrc = settings.logo.startsWith('/uploads')
    ? (process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1").split('/api')[0] + settings.logo
    : settings.logo;

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const role = userInfo?.role?.toLowerCase();
  const isAuthenticated = !!userInfo;

  return (
    <motion.header 
        className="modern-nav glass"
        style={{ 
            background: headerBackground,
            padding: headerPadding,
            boxShadow: headerShadow,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            transition: 'all 0.3s ease-out'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="nav-container w-100 d-flex align-items-center justify-content-between">
        <Link to="/" className="d-flex align-items-center gap-2" style={{ textDecoration: 'none' }}>
          <motion.img 
              src={logoSrc} 
              alt="Logo" 
              style={{ height: '45px', objectFit: 'contain' }} 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
          />
          <h1 className="logo-text">{settings.shopName}</h1>
        </Link>

        <div className="search-container-modern d-none d-md-block flex-grow-1 mx-4">
          <Search />
        </div>

        <div className="nav-actions d-flex align-items-center">
          <Link to={"/cart"} className="btn-modern mx-2" style={{ position: 'relative', color: 'white', padding: '0.5rem 1rem' }}>
            <motion.i 
                className="fa fa-shopping-cart" 
                style={{ fontSize: '1.25rem' }}
                whileHover={{ scale: 1.2, rotate: -10 }}
            ></motion.i>
            {cartItems.length > 0 && (
                <motion.span 
                    className="cart-badge-modern"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={cartItems.length}
                    transition={{ type: "spring", bounce: 0.6 }}
                >
                    {cartItems.length}
                </motion.span>
            )}
          </Link>
          
          {isAuthenticated ? (
              <Link to={role === "admin" ? "/admin/dashboard" : "/user/dashboard"} className="d-flex align-items-center justify-content-center mx-2" title="Account" style={{ color: 'white', textDecoration: 'none' }}>
                 {(() => {
                     if (userInfo.profilePic) {
                         const picUrl = userInfo.profilePic.startsWith('/uploads') 
                            ? (process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1").split('/api')[0] + userInfo.profilePic
                            : userInfo.profilePic;
                         return (
                             <motion.img 
                                src={picUrl}
                                alt="Profile"
                                style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--secondary)' }}
                                whileHover={{ scale: 1.1 }}
                             />
                         );
                     } else if (userInfo.name) {
                         return (
                             <motion.div 
                                 style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--secondary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', border: '2px solid var(--secondary)' }}
                                 whileHover={{ scale: 1.1 }}
                             >
                                 {userInfo.name.charAt(0).toUpperCase()}
                             </motion.div>
                         );
                     }
                     return (
                         <motion.div 
                             style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--secondary)' }}
                             whileHover={{ scale: 1.1 }}
                         >
                             <span style={{ fontSize: '1.25rem' }}>👤</span>
                         </motion.div>
                     );
                 })()}
              </Link>
          ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/login" className="btn-modern" style={{ marginLeft: '1rem', background: 'var(--secondary)', color: 'var(--primary)', fontWeight: 'bold' }}>
                  Login
                  </Link>
              </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
}