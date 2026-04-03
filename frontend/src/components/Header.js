import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Search from "./Search";

export default function Header({ cartItems }) {
  const [settings, setSettings] = useState({ shopName: 'BuyMe', logo: '/images/logo.png' });
  const [categories, setCategories] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch settings
    fetch((process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1") + '/settings')
      .then(res => res.json())
      .then(res => { if (res.success) setSettings(res.settings); })
      .catch(err => console.warn('Header settings fetch fallback:', err.message));

    // Fetch categories for dropdown
    fetch((process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1") + '/categories')
      .then(res => res.json())
      .then(res => setCategories(res.categories || []))
      .catch(() => {});
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoSrc = settings.logo.startsWith('/uploads')
    ? (process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1").split('/api')[0] + settings.logo
    : settings.logo;

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const role = userInfo?.role?.toLowerCase();
  const isAuthenticated = !!userInfo;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <header 
        className={`modern-nav ${isMobileMenuOpen ? 'mobile-menu-active' : ''}`}
        style={{ 
          background: 'rgba(15, 23, 42, 0.75)',
          padding: '0.6rem 2rem', 
          boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 3000, 
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition: 'all 0.3s ease'
        }}
    >
      <div className="nav-container w-100 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-4">
          <Link to="/" className="d-flex align-items-center gap-3" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
            <motion.img src={logoSrc} alt="Logo" style={{ height: '65px', objectFit: 'contain' }} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }} />
            <motion.h1 className="logo-text d-none d-sm-block" style={{ fontSize: '1.9rem', marginBottom: 0, letterSpacing: '-1px', fontWeight: 900 }}>{settings.shopName}</motion.h1>
          </Link>

          {/* Clean Dropdown */}
          <div className="nav-dropdown d-none d-lg-block">
            <button className="btn-modern d-flex align-items-center gap-2" style={{ color: 'white', background: 'transparent', padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem' }}>
              <i className="fas fa-th-large" style={{ color: 'var(--secondary)' }}></i> CATEGORIES
            </button>
            <div className="nav-dropdown-content">
              {categories.slice(0, 10).map((cat) => (
                <Link key={cat._id} to={`/?category=${encodeURIComponent(cat.name)}`} className="nav-dropdown-item">
                  <i className={cat.icon || 'fas fa-tag'}></i> {cat.name}
                </Link>
              ))}
              <hr style={{ margin: '0.5rem 0', opacity: 0.1 }} />
              <Link to="/search" className="nav-dropdown-item" style={{ color: 'var(--primary)', fontWeight: 800 }}>
                Explore All <i className="fas fa-arrow-right ml-1" style={{ fontSize: '0.8rem' }}></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="d-none d-md-flex align-items-center gap-1 flex-wrap justify-content-center">
          {[
            { label: 'Deals', path: '/search?sort=discount', icon: 'fas fa-percentage', color: '#ffbd69' },
            { label: 'New', path: '/new', icon: 'fas fa-fire', color: '#ff6b6b' },
            { label: 'About', path: '/about', icon: 'fas fa-info-circle' },
            { label: 'Contact', path: '/contact', icon: 'fas fa-headset' }
          ].map((link, i) => (
            <Link key={i} to={link.path} style={{ color: 'white', textDecoration: 'none', fontSize: '1.15rem', fontWeight: 800, padding: '0.6rem 1.25rem', borderRadius: '10px', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.6rem', letterSpacing: '0.6px' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--secondary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'transparent'; }}
            >
              <i className={link.icon} style={{ color: link.color || 'var(--secondary)', fontSize: '1.25rem' }}></i>
              <span className="nav-item-text">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="nav-actions d-flex align-items-center gap-2">
          <div className="search-container d-flex" style={{ width: '220px', marginLeft: 'auto', marginRight: '0.5rem' }}>
            <Search />
          </div>

          <Link to={"/cart"} className="btn-modern mx-1" style={{ position: 'relative', color: 'white', padding: '0.5rem' }}>
            <i className="fas fa-shopping-cart" style={{ fontSize: '1.2rem' }}></i>
            {cartItems.length > 0 && <span className="cart-badge-modern">{cartItems.length}</span>}
          </Link>
          
          {isAuthenticated ? (
              <div ref={profileRef} style={{ position: 'relative' }}>
                <motion.button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  style={{ 
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div style={{ 
                    width: '38px', height: '38px', borderRadius: '50%', 
                    background: 'linear-gradient(135deg, var(--secondary), #fa9c23)', 
                    color: 'var(--primary)', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem',
                    border: '2px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                  }}>
                    {userInfo.name?.charAt(0).toUpperCase()}
                  </div>
                  <i className={`fas fa-chevron-${isProfileOpen ? 'up' : 'down'} d-none d-sm-inline`} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}></i>
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      style={{ 
                        position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                        background: 'white', borderRadius: '16px', 
                        boxShadow: '0 20px 60px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)',
                        width: '260px', overflow: 'hidden', zIndex: 5000
                      }}
                    >
                      {/* User Info Header */}
                      <div style={{ 
                        padding: '1.25rem 1.25rem 1rem', 
                        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                        color: 'white'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ 
                            width: '45px', height: '45px', borderRadius: '50%', 
                            background: 'linear-gradient(135deg, var(--secondary), #fa9c23)', 
                            color: 'var(--primary)', display: 'flex', alignItems: 'center', 
                            justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem',
                            flexShrink: 0
                          }}>
                            {userInfo.name?.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ overflow: 'hidden' }}>
                            <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userInfo.name}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userInfo.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown Menu Items */}
                      <div style={{ padding: '0.5rem 0' }}>
                        <Link 
                          to={role === "admin" ? "/admin/dashboard" : "/user/dashboard"} 
                          onClick={() => setIsProfileOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.85rem 1.25rem', color: 'var(--text-main)',
                            textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600,
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <i className="fas fa-user-circle" style={{ width: '20px', color: 'var(--primary)', fontSize: '1rem' }}></i>
                          My Profile
                        </Link>

                        <Link 
                          to={role === "admin" ? "/admin/dashboard" : "/user/dashboard"} 
                          onClick={() => setIsProfileOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.85rem 1.25rem', color: 'var(--text-main)',
                            textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600,
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <i className="fas fa-shopping-bag" style={{ width: '20px', color: 'var(--secondary-dark)', fontSize: '1rem' }}></i>
                          My Orders
                        </Link>

                        <Link 
                          to={role === "admin" ? "/admin/dashboard" : "/user/dashboard"} 
                          onClick={() => setIsProfileOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.85rem 1.25rem', color: 'var(--text-main)',
                            textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600,
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <i className="fas fa-heart" style={{ width: '20px', color: '#ef4444', fontSize: '1rem' }}></i>
                          My Wishlist
                        </Link>

                        {role === 'admin' && (
                          <Link 
                            to="/admin/dashboard" 
                            onClick={() => setIsProfileOpen(false)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '0.75rem',
                              padding: '0.85rem 1.25rem', color: 'var(--text-main)',
                              textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600,
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            <i className="fas fa-shield-alt" style={{ width: '20px', color: '#3b82f6', fontSize: '1rem' }}></i>
                            Admin Panel
                          </Link>
                        )}

                        <div style={{ height: '1px', background: '#e2e8f0', margin: '0.5rem 1rem' }}></div>

                        <button 
                          onClick={handleLogout}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.85rem 1.25rem', color: '#ef4444',
                            background: 'none', border: 'none', width: '100%',
                            fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                            transition: 'all 0.2s ease', textAlign: 'left'
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <i className="fas fa-sign-out-alt" style={{ width: '20px', fontSize: '1rem' }}></i>
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
          ) : (
              <Link to="/login" className="btn-modern btn-secondary-modern" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <i className="fas fa-sign-in-alt"></i>
                <span>Login</span>
              </Link>
          )}

          <button className="d-md-none ml-2" style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.4rem' }} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 300 }} transition={{ type: 'spring', damping: 25 }}
            style={{ background: 'var(--primary)', position: 'fixed', top: 0, right: 0, bottom: 0, width: '280px', padding: '2rem', boxShadow: '-10px 0 50px rgba(0,0,0,0.5)', zIndex: 4000, borderLeft: '1px solid rgba(255,255,255,0.1)' }}
          >
              <div className="d-flex justify-content-between align-items-center mb-5">
                  <span style={{ fontWeight: 900, color: 'var(--secondary)', fontSize: '1.2rem' }}>{settings.shopName}</span>
                  <i className="fas fa-times" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}></i>
              </div>

              {/* Mobile search */}
              <div style={{ marginBottom: '1.5rem' }}>
                <Search />
              </div>

              <div className="d-flex flex-column gap-3">
                  <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link">Home</Link>
                  <Link to="/search" onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link">All Products</Link>
                  <Link to="/new" onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link">New Arrivals</Link>
                  <hr style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }} />
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>Categories</span>
                  {categories.slice(0, 5).map(cat => (
                      <Link key={cat._id} to={`/?category=${encodeURIComponent(cat.name)}`} onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link" style={{ fontSize: '0.9rem' }}>{cat.name}</Link>
                  ))}
                  <hr style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }} />
                  <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link">About Us</Link>
                  <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link">Contact Us</Link>
                  
                  {isAuthenticated ? (
                    <>
                      <hr style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }} />
                      <Link to={role === "admin" ? "/admin/dashboard" : "/user/dashboard"} onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link">
                        <i className="fas fa-user-circle mr-2"></i> My Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="mobile-nav-link"
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 700, cursor: 'pointer', textAlign: 'left', padding: '0.5rem 0', fontSize: '1rem' }}
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <hr style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }} />
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link" style={{ color: 'var(--secondary)' }}>
                        <i className="fas fa-sign-in-alt mr-2"></i> Login / Register
                      </Link>
                    </>
                  )}
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}