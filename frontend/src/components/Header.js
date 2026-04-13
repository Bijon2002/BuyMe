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
    fetch((process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1") + '/settings')
      .then(res => res.json())
      .then(res => { if (res.success) setSettings(res.settings); })
      .catch(err => console.warn('Header settings fetch fallback:', err.message));

    fetch((process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1") + '/categories')
      .then(res => res.json())
      .then(res => setCategories(res.categories || []))
      .catch(() => {});
  }, []);

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
          background: 'rgba(15, 23, 42, 0.95)',
          padding: '0.5rem 1.5rem', 
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
      <div className="nav-container-inner">
        {/* Logo only — no duplicate text */}
        <Link to="/" className="nav-logo-link" onClick={() => setIsMobileMenuOpen(false)}>
          <motion.img 
            src={logoSrc} 
            alt="BuyMe Logo" 
            className="nav-logo-img"
            whileHover={{ scale: 1.05 }} 
            transition={{ type: "spring", stiffness: 300 }} 
          />
        </Link>

        {/* Categories Dropdown — desktop only */}
        <div className="nav-categories">
          <button className="btn-modern nav-cat-btn">
            <i className="fas fa-th-large" style={{ color: 'var(--secondary)' }}></i>
            <span>CATEGORIES</span>
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

        {/* Desktop nav links */}
        <nav className="nav-links">
          {[
            { label: 'Deals', path: '/search?sort=discount', icon: 'fas fa-percentage', color: '#ffbd69' },
            { label: 'New', path: '/new', icon: 'fas fa-fire', color: '#ff6b6b' },
            { label: 'About', path: '/about', icon: 'fas fa-info-circle' },
            { label: 'Contact', path: '/contact', icon: 'fas fa-headset' }
          ].map((link, i) => (
            <Link key={i} to={link.path} className="nav-link-item"
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--secondary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; e.currentTarget.style.background = 'transparent'; }}
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >
              <i className={link.icon} style={{ color: link.color || 'var(--secondary)', fontSize: '1rem' }}></i>
              <span className="nav-item-text">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="nav-right-actions">
          {/* Search */}
          <div className="nav-search-box">
            <Search />
          </div>

          {/* Cart */}
          <Link to="/cart" className="nav-icon-btn" aria-label="Cart">
            <i className="fas fa-shopping-cart"></i>
            {cartItems.length > 0 && (
              <span className="cart-badge-modern">{cartItems.length}</span>
            )}
          </Link>
          
          {/* Profile */}
          {isAuthenticated ? (
            <div ref={profileRef} style={{ position: 'relative' }}>
              <motion.button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="nav-avatar-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="nav-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                  {(() => {
                    const baseUrl = (process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1").split('/api')[0];
                    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name || 'U')}&background=ffbd69&color=0f172a&bold=true&size=128`;
                    const picSrc = userInfo.profilePic
                      ? (userInfo.profilePic.startsWith('/uploads') ? baseUrl + userInfo.profilePic : userInfo.profilePic)
                      : avatarUrl;
                    return (
                      <img
                        src={picSrc}
                        alt={userInfo.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = avatarUrl; }}
                      />
                    );
                  })()}
                </div>
                <i className={`fas fa-chevron-${isProfileOpen ? 'up' : 'down'} d-none d-sm-inline`} 
                   style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', marginLeft: '4px' }}></i>
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="nav-profile-dropdown"
                  >
                    <div className="nav-dropdown-header">
                      <div className="nav-dropdown-avatar">{userInfo.name?.charAt(0).toUpperCase()}</div>
                      <div style={{ overflow: 'hidden' }}>
                        <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userInfo.name}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userInfo.email}</p>
                      </div>
                    </div>

                    <div style={{ padding: '0.5rem 0' }}>
                      {[
                        { to: role === "admin" ? "/admin/dashboard" : "/user/dashboard", icon: 'fa-user-circle', label: 'My Profile', color: 'var(--primary)' },
                        { to: role === "admin" ? "/admin/dashboard" : "/user/dashboard", icon: 'fa-shopping-bag', label: 'My Orders', color: 'var(--secondary-dark)' },
                        { to: role === "admin" ? "/admin/dashboard" : "/user/dashboard", icon: 'fa-heart', label: 'My Wishlist', color: '#ef4444' },
                      ].map((item, i) => (
                        <Link key={i} to={item.to} onClick={() => setIsProfileOpen(false)} className="nav-dropdown-link">
                          <i className={`fas ${item.icon}`} style={{ width: '20px', color: item.color, fontSize: '1rem' }}></i>
                          {item.label}
                        </Link>
                      ))}

                      {role === 'admin' && (
                        <Link to="/admin/dashboard" onClick={() => setIsProfileOpen(false)} className="nav-dropdown-link">
                          <i className="fas fa-shield-alt" style={{ width: '20px', color: '#3b82f6', fontSize: '1rem' }}></i>
                          Admin Panel
                        </Link>
                      )}

                      <div style={{ height: '1px', background: '#e2e8f0', margin: '0.5rem 1rem' }}></div>

                      <button onClick={handleLogout} className="nav-dropdown-link nav-dropdown-logout">
                        <i className="fas fa-sign-out-alt" style={{ width: '20px', fontSize: '1rem' }}></i>
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="btn-modern btn-secondary-modern nav-login-btn">
              <i className="fas fa-sign-in-alt"></i>
              <span className="d-none d-sm-inline">Login</span>
            </Link>
          )}

          {/* Hamburger */}
          <button 
            className="nav-hamburger d-md-none" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="mobile-drawer"
          >
            <div className="mobile-drawer-header">
              <span style={{ fontWeight: 900, color: 'var(--secondary)', fontSize: '1.1rem' }}>Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-close">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{ padding: '1rem' }}>
              <Search />
            </div>

            <div className="mobile-drawer-links">
              {[
                { to: '/', label: '🏠 Home' },
                { to: '/search', label: '🛍️ All Products' },
                { to: '/new', label: '🔥 New Arrivals' },
                { to: '/search?sort=discount', label: '🏷️ Deals' },
                { to: '/about', label: 'ℹ️ About Us' },
                { to: '/contact', label: '📞 Contact Us' },
              ].map((l, i) => (
                <Link key={i} to={l.to} onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link">{l.label}</Link>
              ))}

              {categories.length > 0 && (
                <>
                  <div className="mobile-drawer-divider">Categories</div>
                  {categories.slice(0, 6).map(cat => (
                    <Link key={cat._id} to={`/?category=${encodeURIComponent(cat.name)}`} onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link" style={{ fontSize: '0.9rem' }}>
                      <i className={cat.icon || 'fas fa-tag'} style={{ marginRight: '8px', color: 'var(--secondary)', fontSize: '0.85rem' }}></i>{cat.name}
                    </Link>
                  ))}
                </>
              )}

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '1rem 0' }}></div>

              {isAuthenticated ? (
                <>
                  <Link to={role === "admin" ? "/admin/dashboard" : "/user/dashboard"} onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link">
                    <i className="fas fa-user-circle" style={{ marginRight: '8px', color: 'var(--secondary)' }}></i> My Account
                  </Link>
                  <button onClick={handleLogout} className="mobile-drawer-link mobile-logout-btn">
                    <i className="fas fa-sign-out-alt" style={{ marginRight: '8px' }}></i> Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="mobile-drawer-link" style={{ color: 'var(--secondary)', fontWeight: 700 }}>
                  <i className="fas fa-sign-in-alt" style={{ marginRight: '8px' }}></i> Login / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}