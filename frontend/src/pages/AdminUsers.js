import { useEffect, useState } from 'react';
import API from '../api/axiosConfig';
import './AdminDashboard.css';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data.users);
    } catch (error) {
      console.error('Failed to load users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const action = currentStatus ? 'Deactivate' : 'Activate';
    if (!window.confirm(`${action} this user?`)) return;

    try {
      await API.put(`/admin/users/${id}/status`, { isActive: !currentStatus });
      fetchUsers();
      toast.success(`User ${action}d successfully!`, { position: "top-center", autoClose: 2000 });
    } catch (error) {
      toast.error(`Failed to ${action} user`, { position: "top-center", autoClose: 2000 });
      console.error('Status toggle failed', error);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="loading-container">
      <div className="premium-loader" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="loader-ring" style={{ width: '50px', height: '50px', borderRadius: '50%', border: '4px solid rgba(115,21,46,0.1)', borderTopColor: 'var(--primary)', animation: 'rotate-slow 1s linear infinite' }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Loading users...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4" data-aos="fade-down">
        <h2 className="page-title">User Management</h2>
        <div style={{ position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.85rem' }}></i>
          <input
            type="text"
            className="form-input-modern"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.5rem', maxWidth: '300px', borderRadius: '999px', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      <div className="activity-table" data-aos="fade-up">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, i) => (
              <motion.tr 
                key={user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 300 }}
              >
                <td>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary), #a01d3f)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 800, fontSize: '1rem', flexShrink: 0
                    }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 700 }}>{user.name}</span>
                  </div>
                </td>
                <td className="email-text">{user.email}</td>
                <td>
                  <span className={`status-chip ${user.isActive ? 'active' : 'blocked'}`}>
                    <i className={`fas ${user.isActive ? 'fa-check-circle' : 'fa-ban'} mr-1`} style={{ fontSize: '0.7rem' }}></i>
                    {user.isActive ? 'Active' : 'Deactivated'}
                  </span>
                </td>
                <td>
                  <motion.button
                    className={`danger-btn ${user.isActive ? '' : 'activate-btn'}`}
                    onClick={() => handleToggleStatus(user._id, user.isActive)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className={`fas ${user.isActive ? 'fa-user-slash' : 'fa-user-check'} mr-1`}></i>
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '0.5rem' }}>👥</div>
            <p className="empty-text" style={{ padding: '0' }}>No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
