import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axiosConfig';
import AdminUsers from './AdminUsers';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminSettings from './AdminSettings';
import AdminAnalytics from './AdminAnalytics';
import './AdminDashboard.css';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
};

const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300 } }
}

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    if (!userInfo) {
      navigate('/login');
      return;
    }
    
    if (userInfo.role !== 'admin') {
      alert('Access denied. Admin only.');
      navigate('/');
      return;
    }
    
    setUser(userInfo);
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get('/admin/stats');
      const { stats } = res.data;
      setStats({
        totalUsers: stats.totalUsers,
        totalProducts: stats.totalProducts,
        totalOrders: stats.totalOrders,
        revenue: stats.revenue,
        recentUsers: stats.recentUsers.map(u => ({
          name: u.name,
          email: u.email,
          joined: new Date(u.createdAt).toLocaleDateString(),
          status: u.isActive ? 'active' : 'deactivated'
        }))
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <img src="/images/loader.gif" alt="Loading..." className="loader-img" />
      </div>
    );
  }

  return (
    <div className="admin-dashboard-wrapper">
      <nav className="premium-navbar">
        <div className="nav-container">
          <div className="nav-left">
             <Link to="/" style={{ textDecoration: 'none' }}>
                <h1 className="logo-text" style={{ fontSize: '1.5rem', marginBottom: 0 }}>BuyMe</h1>
             </Link>
          </div>
          <h1 className="portal-title">ADMIN CONTROL</h1>
          <div className="nav-right">
            <button className="logout-btn" onClick={handleLogout}>
              Logout !
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-layout">
        {/* Sleek Sidebar */}
        <aside className="sleek-sidebar">
          <div className="sidebar-content">
            {[
              { id: 'dashboard', icon: '◆', label: 'Overview' },
              { id: 'users', icon: '◇', label: 'Users' },
              { id: 'products', icon: '◈', label: 'Products' },
              { id: 'orders', icon: '◉', label: 'Orders' },
              { id: 'analytics', icon: '◊', label: 'Analytics' },
              { id: 'settings', icon: '◐', label: 'Settings' }
            ].map((item) => (
              <button
                key={item.id}
                className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {activeTab === item.id && <span className="active-indicator"></span>}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Dashboard */}
        <main className="dashboard-main">
          {activeTab === 'dashboard' && (
            <>
              {/* Hero Section */}
              <div className="hero-section">
                <div className="hero-content">
                  <h2 className="hero-title">Welcome Back, {user?.name?.split(' ')[0]}!</h2>
                  <p className="hero-subtitle">Here's your business snapshot</p>
                </div>
                <div className="hero-date">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>

              {/* Stats Row */}
              <motion.div 
                className="stats-row"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={itemVariants} className="stat-box primary">
                  <div className="stat-header">
                    <span className="stat-icon">●</span>
                    <span className="stat-growth">+12%</span>
                  </div>
                  <h3 className="stat-number">{stats.totalUsers}</h3>
                  <p className="stat-label">Total Users</p>
                </motion.div>

                <motion.div variants={itemVariants} className="stat-box success">
                  <div className="stat-header">
                    <span className="stat-icon">●</span>
                    <span className="stat-growth">+5%</span>
                  </div>
                  <h3 className="stat-number">{stats.totalProducts}</h3>
                  <p className="stat-label">Products</p>
                </motion.div>

                <motion.div variants={itemVariants} className="stat-box warning">
                  <div className="stat-header">
                    <span className="stat-icon">●</span>
                    <span className="stat-growth">+23%</span>
                  </div>
                  <h3 className="stat-number">{stats.totalOrders}</h3>
                  <p className="stat-label">Orders</p>
                </motion.div>

                <motion.div variants={itemVariants} className="stat-box revenue">
                  <div className="stat-header">
                    <span className="stat-icon">💰</span>
                    <span className="stat-growth">Target Met</span>
                  </div>
                  <h3 className="stat-number">${stats.revenue?.toLocaleString() || 0}</h3>
                  <p className="stat-label">Total Revenue</p>
                </motion.div>
              </motion.div>

              {/* Activity Section */}
              <motion.div 
                className="activity-section"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <div className="section-top">
                  <div>
                    <h3 className="section-title">Recent Activity</h3>
                    <p className="section-desc">Latest user registrations</p>
                  </div>
                  <button className="btn-view-all">View All →</button>
                </div>

                <div className="activity-table">
                  <table>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <motion.tbody
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                      {stats.recentUsers.map((user, idx) => (
                        <motion.tr key={idx} variants={tableRowVariants} custom={idx}>
                          <td>
                            <div className="user-display">
                              <div className="user-circle">{user.name.charAt(0)}</div>
                              <span className="user-text">{user.name}</span>
                            </div>
                          </td>
                          <td className="email-text">{user.email}</td>
                          <td className="date-text">{user.joined}</td>
                          <td>
                            <span className={`status-chip ${user.status}`}>
                              {user.status}
                            </span>
                          </td>
                          <td>
                            <button className="action-menu">⋮</button>
                          </td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  </table>
                </div>
              </motion.div>
            </>
          )}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'analytics' && <AdminAnalytics />}
          {activeTab === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
}