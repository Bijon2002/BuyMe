import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import './UserDashboard.css';

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);
  const [uploadingInfo, setUploadingInfo] = useState(false);

  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const { data } = await API.get('/auth/me');
      if (data.success) {
        setUser(data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const fetchUserOrders = async () => {
    try {
      const { data } = await API.get('/order/myorders');
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
        setLoading(true);
        await Promise.all([fetchUserProfile(), fetchUserOrders()]);
        setLoading(false);
    };
    loadAllData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const handlePicChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          setProfilePicFile(file);
          setPreviewPic(URL.createObjectURL(file));
      }
  };

  const uploadProfilePic = async () => {
      if (!profilePicFile) return;
      setUploadingInfo(true);
      try {
          const formData = new FormData();
          formData.append('profilePic', profilePicFile);
          const { data } = await API.put('/auth/profile', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          if (data.success) {
              toast.success('Profile picture updated!');
              localStorage.setItem('userInfo', JSON.stringify(data.data));
              setUser(data.data);
              setProfilePicFile(null);
              window.location.reload();
          }
      } catch (error) {
          toast.error('Failed to upload picture');
      } finally {
          setUploadingInfo(false);
      }
  };

  const removeFavorite = async (productId) => {
      try {
          const { data } = await API.post(`/auth/favorites/${productId}`);
          if (data.success) {
              toast.success('Removed from favorites');
              fetchUserProfile();
          }
      } catch (error) {
          toast.error('Failed to remove favorite');
      }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="premium-loader">
              <div className="loader-ring"></div>
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Loading your dashboard...</p>
          </div>
      </div>
    );
  }

  const picUrl = previewPic 
      ? previewPic 
      : (user?.profilePic?.startsWith('/uploads') 
          ? (process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1").split('/api')[0] + user.profilePic 
          : user?.profilePic);

  const sidebarItems = [
    { id: 'overview', icon: 'fa-th-large', label: 'Dashboard' },
    { id: 'orders', icon: 'fa-box', label: 'Your Orders' },
    { id: 'favorites', icon: 'fa-heart', label: 'Wish List' },
    { id: 'profile', icon: 'fa-user-edit', label: 'Account Settings' },
    { id: 'security', icon: 'fa-shield-alt', label: 'Login & Security' },
  ];

  const deliveredOrders = orders.filter(o => o.status === 'Delivered');
  const pendingOrders = orders.filter(o => o.status !== 'Delivered');
  const totalSpent = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

  return (
    <div className="ud-wrapper">
      {/* Sidebar */}
      <aside className="ud-sidebar">
        <div className="ud-sidebar-header">
          <div className="ud-sidebar-avatar-wrapper">
            {picUrl ? (
              <img src={picUrl} alt="Profile" className="ud-sidebar-avatar" />
            ) : (
              <div className="ud-sidebar-avatar ud-sidebar-avatar-placeholder">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="ud-sidebar-user-info">
            <p className="ud-sidebar-greeting">Hello,</p>
            <h4 className="ud-sidebar-name">{user?.name}</h4>
          </div>
        </div>

        <nav className="ud-sidebar-nav">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`ud-sidebar-link ${activeSection === item.id ? 'active' : ''}`}
            >
              <i className={`fas ${item.icon}`}></i>
              <span>{item.label}</span>
              {item.id === 'orders' && orders.length > 0 && (
                <span className="ud-sidebar-badge">{orders.length}</span>
              )}
              {item.id === 'favorites' && user?.favorites?.length > 0 && (
                <span className="ud-sidebar-badge ud-sidebar-badge-heart">{user.favorites.length}</span>
              )}
            </button>
          ))}

          <div className="ud-sidebar-divider"></div>

          <button onClick={handleLogout} className="ud-sidebar-link ud-sidebar-logout">
            <i className="fas fa-sign-out-alt"></i>
            <span>Sign Out</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ud-main">
        <AnimatePresence mode="wait">
          
          {/* ===== OVERVIEW SECTION ===== */}
          {activeSection === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              
              {/* Welcome Banner */}
              <div className="ud-welcome-banner">
                <div className="ud-welcome-content">
                  <h2>Welcome back, {user?.name?.split(' ')[0]}!</h2>
                  <p>Here's what's happening with your account.</p>
                </div>
                <div className="ud-welcome-actions">
                  <Link to="/" className="ud-btn ud-btn-primary">
                    <i className="fas fa-store mr-2"></i> Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Quick Stats Cards */}
              <div className="ud-stats-grid">
                <motion.div className="ud-stat-card" whileHover={{ y: -4 }}>
                  <div className="ud-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                    <i className="fas fa-shopping-bag"></i>
                  </div>
                  <div className="ud-stat-info">
                    <span className="ud-stat-number">{orders.length}</span>
                    <span className="ud-stat-label">Total Orders</span>
                  </div>
                </motion.div>

                <motion.div className="ud-stat-card" whileHover={{ y: -4 }}>
                  <div className="ud-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="ud-stat-info">
                    <span className="ud-stat-number">{deliveredOrders.length}</span>
                    <span className="ud-stat-label">Delivered</span>
                  </div>
                </motion.div>

                <motion.div className="ud-stat-card" whileHover={{ y: -4 }}>
                  <div className="ud-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="ud-stat-info">
                    <span className="ud-stat-number">{pendingOrders.length}</span>
                    <span className="ud-stat-label">In Progress</span>
                  </div>
                </motion.div>

                <motion.div className="ud-stat-card" whileHover={{ y: -4 }}>
                  <div className="ud-stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                    <i className="fas fa-heart"></i>
                  </div>
                  <div className="ud-stat-info">
                    <span className="ud-stat-number">{user?.favorites?.length || 0}</span>
                    <span className="ud-stat-label">Wishlist Items</span>
                  </div>
                </motion.div>
              </div>

              {/* Quick Action Cards (Amazon-style) */}
              <h3 className="ud-section-title">Quick Actions</h3>
              <div className="ud-quick-actions-grid">
                {[
                  { icon: 'fa-box', title: 'Your Orders', desc: 'Track, return, or buy things again', action: () => setActiveSection('orders'), color: '#3b82f6' },
                  { icon: 'fa-heart', title: 'Your Wish List', desc: 'View saved items & move to cart', action: () => setActiveSection('favorites'), color: '#ef4444' },
                  { icon: 'fa-user-edit', title: 'Account Settings', desc: 'Edit profile & manage preferences', action: () => setActiveSection('profile'), color: '#8b5cf6' },
                  { icon: 'fa-shield-alt', title: 'Login & Security', desc: 'Edit login, name, and email', action: () => setActiveSection('security'), color: '#10b981' },
                  { icon: 'fa-credit-card', title: 'Payment Methods', desc: 'Manage payment methods', action: () => toast.info('Coming soon!'), color: '#f59e0b' },
                  { icon: 'fa-headset', title: 'Contact Us', desc: 'Get help with your account', action: () => navigate('/contact'), color: '#06b6d4' },
                ].map((card, i) => (
                  <motion.div 
                    key={i} 
                    className="ud-action-card" 
                    onClick={card.action}
                    whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="ud-action-card-icon" style={{ color: card.color }}>
                      <i className={`fas ${card.icon}`}></i>
                    </div>
                    <div className="ud-action-card-info">
                      <h5>{card.title}</h5>
                      <p>{card.desc}</p>
                    </div>
                    <i className="fas fa-chevron-right ud-action-arrow"></i>
                  </motion.div>
                ))}
              </div>

              {/* Recent Orders */}
              {orders.length > 0 && (
                <>
                  <div className="ud-section-header">
                    <h3 className="ud-section-title">Recent Orders</h3>
                    <button onClick={() => setActiveSection('orders')} className="ud-link-btn">View All Orders →</button>
                  </div>
                  <div className="ud-orders-preview">
                    {orders.slice(0, 3).map((order, i) => (
                      <motion.div 
                        key={order._id} 
                        className="ud-order-preview-card"
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <div className="ud-order-preview-left">
                          <div className={`ud-order-status-dot ${order.status === 'Delivered' ? 'delivered' : 'pending'}`}></div>
                          <div>
                            <p className="ud-order-id">Order #{order._id.substring(0, 8).toUpperCase()}</p>
                            <p className="ud-order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="ud-order-preview-right">
                          <span className="ud-order-amount">${Number(order.amount).toFixed(2)}</span>
                          <span className={`ud-order-status-badge ${order.status === 'Delivered' ? 'delivered' : 'pending'}`}>
                            {order.status || 'Processing'}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ===== ORDERS SECTION ===== */}
          {activeSection === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <div className="ud-page-header">
                <h2><i className="fas fa-box mr-2" style={{ color: 'var(--secondary)' }}></i> Your Orders</h2>
                <p>Track and manage all your orders</p>
              </div>

              {orders.length === 0 ? (
                <div className="ud-empty-state">
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <i className="fas fa-shopping-cart"></i>
                  </motion.div>
                  <h4>No Orders Yet</h4>
                  <p>Looks like you haven't made any purchases.</p>
                  <Link to="/" className="ud-btn ud-btn-primary">Start Shopping</Link>
                </div>
              ) : (
                <div className="ud-orders-list">
                  {orders.map((order, i) => (
                    <motion.div 
                      key={order._id} 
                      className="ud-order-card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="ud-order-card-header">
                        <div className="ud-order-card-meta">
                          <div>
                            <span className="ud-order-card-label">ORDER PLACED</span>
                            <span className="ud-order-card-value">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                          <div>
                            <span className="ud-order-card-label">TOTAL</span>
                            <span className="ud-order-card-value ud-order-card-amount">${Number(order.amount).toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="ud-order-card-label">ORDER #</span>
                            <span className="ud-order-card-value" style={{ fontFamily: 'monospace' }}>{order._id.substring(0, 12).toUpperCase()}</span>
                          </div>
                        </div>
                        <span className={`ud-order-status-badge-lg ${order.status === 'Delivered' ? 'delivered' : 'pending'}`}>
                          <i className={`fas ${order.status === 'Delivered' ? 'fa-check-circle' : 'fa-clock'} mr-1`}></i>
                          {order.status || 'Processing'}
                        </span>
                      </div>
                      {order.items && order.items.length > 0 && (
                        <div className="ud-order-card-items">
                          {order.items.slice(0, 3).map((item, j) => (
                            <div key={j} className="ud-order-item-mini">
                              <span className="ud-order-item-name">{item.name || 'Product'}</span>
                              <span className="ud-order-item-qty">x{item.quantity || 1}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="ud-order-card-footer">
                        <Link to={`/order/${order._id}`} className="ud-btn ud-btn-outline-sm">View Order Details</Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ===== FAVORITES/WISHLIST SECTION ===== */}
          {activeSection === 'favorites' && (
            <motion.div key="favorites" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <div className="ud-page-header">
                <h2><i className="fas fa-heart mr-2" style={{ color: '#ef4444' }}></i> Your Wish List</h2>
                <p>Items you've saved for later</p>
              </div>

              {!user?.favorites || user.favorites.length === 0 ? (
                <div className="ud-empty-state">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <i className="fas fa-heart"></i>
                  </motion.div>
                  <h4>Your Wish List is Empty</h4>
                  <p>Save items you love to your wish list to keep track of them.</p>
                  <Link to="/" className="ud-btn ud-btn-primary">Discover Products</Link>
                </div>
              ) : (
                <div className="ud-wishlist-grid">
                  {user.favorites.map((product, i) => {
                    if (typeof product === 'string') return null;
                    const imgSrc = (() => {
                      const img = product.images?.[0];
                      const path = img?.image || img?.url || "/images/products/1.jpg";
                      if (path.startsWith('/uploads')) {
                        return (process.env.REACT_APP_API_URL || "http://localhost:8000").split('/api')[0] + path;
                      }
                      return path;
                    })();
                    return (
                      <motion.div 
                        key={product._id} 
                        className="ud-wishlist-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        whileHover={{ y: -4 }}
                      >
                        <div className="ud-wishlist-img-wrapper">
                          <img src={imgSrc} alt={product.name} className="ud-wishlist-img" />
                          <motion.button 
                            onClick={() => removeFavorite(product._id)} 
                            className="ud-wishlist-remove-btn"
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.85 }}
                            title="Remove from wishlist"
                          >
                            <i className="fas fa-times"></i>
                          </motion.button>
                        </div>
                        <div className="ud-wishlist-info">
                          <Link to={`/product/${product._id}`} className="ud-wishlist-title">{product.name}</Link>
                          <p className="ud-wishlist-price">${product.price}</p>
                          <Link to={`/product/${product._id}`} className="ud-btn ud-btn-primary ud-btn-sm">
                            View Product
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ===== PROFILE/ACCOUNT SETTINGS SECTION ===== */}
          {activeSection === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <div className="ud-page-header">
                <h2><i className="fas fa-user-edit mr-2" style={{ color: '#8b5cf6' }}></i> Account Settings</h2>
                <p>Manage your profile information</p>
              </div>

              <div className="ud-profile-card">
                {/* Profile Picture Section */}
                <div className="ud-profile-pic-section">
                  <div className="ud-profile-pic-wrapper">
                    {picUrl ? (
                      <img src={picUrl} alt="Profile" className="ud-profile-pic" />
                    ) : (
                      <div className="ud-profile-pic ud-profile-pic-placeholder">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <label className="ud-profile-pic-edit" title="Change Profile Picture">
                      <i className="fa fa-camera"></i>
                      <input type="file" hidden onChange={handlePicChange} accept="image/*" />
                    </label>
                  </div>
                  
                  {profilePicFile && (
                    <motion.button 
                      onClick={uploadProfilePic} 
                      disabled={uploadingInfo} 
                      className="ud-btn ud-btn-primary ud-btn-sm mt-3"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {uploadingInfo ? <><i className="fa fa-spinner fa-spin mr-2"></i>Saving...</> : <><i className="fa fa-save mr-2"></i>Save Picture</>}
                    </motion.button>
                  )}
                </div>

                {/* Profile Info */}
                <div className="ud-profile-info-grid">
                  <div className="ud-profile-field">
                    <label>Full Name</label>
                    <div className="ud-profile-field-value">
                      <i className="fas fa-user"></i>
                      <span>{user?.name}</span>
                    </div>
                  </div>
                  <div className="ud-profile-field">
                    <label>Email Address</label>
                    <div className="ud-profile-field-value">
                      <i className="fas fa-envelope"></i>
                      <span>{user?.email}</span>
                    </div>
                  </div>
                  <div className="ud-profile-field">
                    <label>Account Status</label>
                    <div className="ud-profile-field-value">
                      <i className="fas fa-shield-alt" style={{ color: '#10b981' }}></i>
                      <span className="ud-verified-badge">
                        <i className="fas fa-check-circle mr-1"></i> {user?.isActive ? 'Verified & Active' : 'Restricted'}
                      </span>
                    </div>
                  </div>
                  <div className="ud-profile-field">
                    <label>Member Since</label>
                    <div className="ud-profile-field-value">
                      <i className="fas fa-calendar-alt"></i>
                      <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="ud-profile-field">
                    <label>Role</label>
                    <div className="ud-profile-field-value">
                      <i className="fas fa-id-badge"></i>
                      <span style={{ textTransform: 'capitalize' }}>{user?.role || 'Customer'}</span>
                    </div>
                  </div>
                  <div className="ud-profile-field">
                    <label>Total Spent</label>
                    <div className="ud-profile-field-value">
                      <i className="fas fa-dollar-sign" style={{ color: 'var(--secondary)' }}></i>
                      <span style={{ fontWeight: 800 }}>${totalSpent.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== SECURITY SECTION ===== */}
          {activeSection === 'security' && (
            <motion.div key="security" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
              <div className="ud-page-header">
                <h2><i className="fas fa-shield-alt mr-2" style={{ color: '#10b981' }}></i> Login & Security</h2>
                <p>Manage your login credentials and security preferences</p>
              </div>

              <div className="ud-security-list">
                <div className="ud-security-item">
                  <div className="ud-security-item-info">
                    <h5>Name</h5>
                    <p>{user?.name}</p>
                  </div>
                  <button className="ud-btn ud-btn-outline-sm" onClick={() => toast.info('Coming soon!')}>Edit</button>
                </div>
                <div className="ud-security-item">
                  <div className="ud-security-item-info">
                    <h5>Email</h5>
                    <p>{user?.email}</p>
                  </div>
                  <button className="ud-btn ud-btn-outline-sm" onClick={() => toast.info('Coming soon!')}>Edit</button>
                </div>
                <div className="ud-security-item">
                  <div className="ud-security-item-info">
                    <h5>Password</h5>
                    <p>••••••••</p>
                  </div>
                  <button className="ud-btn ud-btn-outline-sm" onClick={() => toast.info('Coming soon!')}>Edit</button>
                </div>
                <div className="ud-security-item">
                  <div className="ud-security-item-info">
                    <h5>Two-step verification</h5>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <button className="ud-btn ud-btn-outline-sm" onClick={() => toast.info('Coming soon!')}>Turn On</button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}