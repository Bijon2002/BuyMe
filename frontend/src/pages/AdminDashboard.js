import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axiosConfig';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';
import AdminAnalytics from './AdminAnalytics';
import AdminSettings from './AdminSettings';
import AdminCategories from './AdminCategories';
import AdminContacts from './AdminContacts';
import AdminSubscribers from './AdminSubscribers';
import CountUpNumber from '../components/CountUpNumber';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          API.get('/admin/users'),
          API.get('/products'),
          API.get('/admin/orders')
        ]);
        
        const orders = ordersRes.data.orders || [];
        const revenue = orders.reduce((acc, o) => acc + Number(o.amount || 0), 0);
        
        setStats({
          totalUsers: usersRes.data.users?.length || 0,
          totalProducts: productsRes.data.products?.length || 0,
          totalOrders: orders.length,
          totalRevenue: revenue
        });
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const tabs = [
    { id: 'overview', icon: 'fa-chart-pie', label: 'Overview' },
    { id: 'products', icon: 'fa-box-open', label: 'Products' },
    { id: 'categories', icon: 'fa-tags', label: 'Categories' },
    { id: 'orders', icon: 'fa-shopping-cart', label: 'Orders' },
    { id: 'users', icon: 'fa-users', label: 'Users' },
    { id: 'analytics', icon: 'fa-chart-line', label: 'Analytics' },
    { id: 'contacts', icon: 'fa-envelope-open-text', label: 'Inquiries' },
    { id: 'subscribers', icon: 'fa-at', label: 'Subscribers' },
    { id: 'settings', icon: 'fa-cog', label: 'Settings' },
  ];

  const statCards = [
    { title: 'Total Revenue', value: stats.totalRevenue, prefix: '$', icon: 'fa-dollar-sign', bg: 'linear-gradient(135deg, #667eea, #764ba2)', decimals: 2 },
    { title: 'Total Orders', value: stats.totalOrders, icon: 'fa-shopping-bag', bg: 'linear-gradient(135deg, #f093fb, #f5576c)', suffix: '' },
    { title: 'Total Products', value: stats.totalProducts, icon: 'fa-box', bg: 'linear-gradient(135deg, #4facfe, #00f2fe)', suffix: '' },
    { title: 'Total Users', value: stats.totalUsers, icon: 'fa-users', bg: 'linear-gradient(135deg, #43e97b, #38f9d7)', suffix: '' },
  ];

  return (
    <div className="admin-dashboard-layout">
      {/* Sidebar */}
      <motion.aside 
        className="admin-sidebar"
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <div className="sidebar-header">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 className="sidebar-logo">Buy<span>Me</span></h2>
          </Link>
          <p className="sidebar-subtitle">Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          {tabs.map((tab, i) => (
            <motion.button
              key={tab.id}
              className={`sidebar-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <i className={`fas ${tab.icon}`}></i>
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div className="sidebar-active-indicator" layoutId="activeTab" />
              )}
            </motion.button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <p className="sidebar-user-name">{userInfo.name || 'Admin'}</p>
              <p className="sidebar-user-role">Administrator</p>
            </div>
          </div>
          <motion.button 
            onClick={handleLogout} 
            className="sidebar-logout-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="admin-main-content">
        {/* Top Bar */}
        <div className="admin-topbar" data-aos="fade-down">
          <div>
            <h1 className="admin-page-title">
              {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
            </h1>
            <p className="admin-page-subtitle">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <Link to="/" className="btn-modern" style={{ background: 'rgba(115,21,46,0.08)', color: 'var(--primary)', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              <i className="fas fa-store mr-1"></i> View Store
            </Link>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              {/* Stat Cards */}
              <div className="admin-stats-grid">
                {statCards.map((card, i) => (
                  <motion.div 
                    key={card.title} 
                    className="admin-stat-card"
                    data-aos="fade-up" 
                    data-aos-delay={i * 100}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="admin-stat-icon" style={{ background: card.bg }}>
                      <i className={`fas ${card.icon}`}></i>
                    </div>
                    <div>
                      <p className="admin-stat-label">{card.title}</p>
                      <h3 className="admin-stat-value">
                        <CountUpNumber end={card.value} prefix={card.prefix || ''} suffix={card.suffix || ''} decimals={card.decimals || 0} />
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="admin-quick-actions" data-aos="fade-up" data-aos-delay="200">
                <h3 className="admin-section-title"><i className="fas fa-bolt mr-2" style={{ color: 'var(--secondary)' }}></i>Quick Actions</h3>
                <div className="quick-actions-grid">
                  {[
                    { label: 'Add Product', icon: 'fa-plus', color: '#667eea', onClick: () => setActiveTab('products') },
                    { label: 'View Orders', icon: 'fa-eye', color: '#f5576c', onClick: () => setActiveTab('orders') },
                    { label: 'Manage Users', icon: 'fa-user-cog', color: '#43e97b', onClick: () => setActiveTab('users') },
                    { label: 'Analytics', icon: 'fa-chart-bar', color: '#4facfe', onClick: () => setActiveTab('analytics') },
                  ].map((action, i) => (
                    <motion.button 
                      key={action.label}
                      className="quick-action-card"
                      onClick={action.onClick}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="quick-action-icon" style={{ background: `${action.color}20`, color: action.color }}>
                        <i className={`fas ${action.icon}`}></i>
                      </div>
                      <span>{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="admin-recent-orders" data-aos="fade-up" data-aos-delay="300">
                <h3 className="admin-section-title"><i className="fas fa-clock mr-2" style={{ color: 'var(--secondary)' }}></i>Recent Orders</h3>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order, i) => (
                        <motion.tr 
                          key={order._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <td className="order-id-cell">#{order._id.substring(0,8).toUpperCase()}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>{order.CartItems?.length || 0} items</td>
                          <td className="gradient-text" style={{ fontWeight: 800 }}>${Number(order.amount).toFixed(2)}</td>
                          <td>
                            <span className={`status-badge status-${(order.status || 'pending').toLowerCase()}`}>
                              {order.status || 'Pending'}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                      {recentOrders.length === 0 && (
                        <tr><td colSpan="5" className="text-center text-muted py-4">No orders yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* OTHER TABS */}
          {activeTab === 'products' && (
            <motion.div key="products" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <AdminProducts />
            </motion.div>
          )}
          {activeTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <AdminOrders />
            </motion.div>
          )}
          {activeTab === 'categories' && (
            <motion.div key="categories" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <AdminCategories />
            </motion.div>
          )}
          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <AdminUsers />
            </motion.div>
          )}
          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <AdminAnalytics />
            </motion.div>
          )}
          {activeTab === 'contacts' && (
            <motion.div key="contacts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <AdminContacts />
            </motion.div>
          )}
          {activeTab === 'subscribers' && (
            <motion.div key="subscribers" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <AdminSubscribers />
            </motion.div>
          )}
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <AdminSettings />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}