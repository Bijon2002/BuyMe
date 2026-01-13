import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';
import AdminUsers from './AdminUsers';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import './AdminDashboard.css';

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
      // In real app, you'd have admin endpoints
      // For now, we'll simulate data
      setStats({
        totalUsers: 150,
        totalProducts: 45,
        totalOrders: 320,
        recentUsers: [
          { name: 'John Doe', email: 'john@example.com', joined: '2024-01-15', status: 'active' },
          { name: 'Jane Smith', email: 'jane@example.com', joined: '2024-01-14', status: 'active' },
          { name: 'Bob Wilson', email: 'bob@example.com', joined: '2024-01-13', status: 'active' },
          { name: 'Alice Brown', email: 'alice@example.com', joined: '2024-01-12', status: 'active' },
          { name: 'Charlie Davis', email: 'charlie@example.com', joined: '2024-01-11', status: 'pending' }
        ]
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
        <div className="spinner-wrapper">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-wrapper">
      {/* Premium Navbar */}
      <nav className="premium-navbar">
        <div className="nav-container">
          <div className="nav-left">
            <img src="/images/logo.png" alt="Logo" className="navbar-logo" />
          </div>
          <h1 className="portal-title">Admin Control</h1>
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
              <div className="stats-row">
                <div className="stat-box primary">
                  <div className="stat-header">
                    <span className="stat-icon">●</span>
                    <span className="stat-growth">+12%</span>
                  </div>
                  <h3 className="stat-number">{stats.totalUsers}</h3>
                  <p className="stat-label">Total Users</p>
                </div>

                <div className="stat-box success">
                  <div className="stat-header">
                    <span className="stat-icon">●</span>
                    <span className="stat-growth">+5%</span>
                  </div>
                  <h3 className="stat-number">{stats.totalProducts}</h3>
                  <p className="stat-label">Products</p>
                </div>

                <div className="stat-box warning">
                  <div className="stat-header">
                    <span className="stat-icon">●</span>
                    <span className="stat-growth">+23%</span>
                  </div>
                  <h3 className="stat-number">{stats.totalOrders}</h3>
                  <p className="stat-label">Orders</p>
                </div>

                <div className="stat-box revenue">
                  <div className="stat-header">
                    <span className="stat-icon">●</span>
                    <span className="stat-growth">+18%</span>
                  </div>
                  <h3 className="stat-number">$12.4K</h3>
                  <p className="stat-label">Revenue</p>
                </div>
              </div>

              {/* Activity Section */}
              <div className="activity-section">
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
                    <tbody>
                      {stats.recentUsers.map((user, idx) => (
                        <tr key={idx}>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'analytics' && <div className="content-placeholder"><h3>Analytics Coming Soon</h3></div>}
          {activeTab === 'settings' && <div className="content-placeholder"><h3>Settings Coming Soon</h3></div>}
        </main>
      </div>
    </div>
  );
}