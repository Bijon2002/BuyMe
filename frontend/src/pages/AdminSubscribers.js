import { useEffect, useState } from 'react';
import API from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import './AdminDashboard.css';

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);

  const fetchSubscribers = async () => {
    try {
      const res = await API.get('/newsletter/admin/subscribers');
      setSubscribers(res.data.subscribers || []);
    } catch (error) {
      console.error('Failed to load subscribers', error);
      toast.error('Failed to load subscribers list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubscribers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this subscriber from the premium list?')) return;
    
    setIsDeleting(id);
    try {
      await API.delete(`/newsletter/admin/subscribers/${id}`);
      toast.success('Subscriber successfully removed');
      fetchSubscribers();
    } catch (error) {
      toast.error('Failed to remove subscriber');
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '4px solid rgba(115,21,46,0.1)', borderTopColor: 'var(--primary)', animation: 'rotate-slow 1s linear infinite' }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Loading Elite list...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4" data-aos="fade-down">
        <h2 className="page-title">Newsletter Subscribers</h2>
        <span style={{ background: 'rgba(115,21,46,0.06)', padding: '8px 16px', borderRadius: '999px', fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
          {subscribers.length} Global Subscribers
        </span>
      </div>

      <div className="activity-table" data-aos="fade-up">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Subscriber Email</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((sub, i) => (
              <motion.tr
                key={sub._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.5rem', background: '#f8fafc', borderRadius: '10px', color: 'var(--primary)' }}>
                      <i className="fas fa-envelope-open-text"></i>
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{sub.email}</span>
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>
                    {new Date(sub.subscribedAt || sub.createdAt || Date.now()).toLocaleDateString('en-US', { 
                        year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </span>
                </td>
                <td>
                  <span className="status-badge status-delivered">Verified Elite</span>
                </td>
                <td>
                  <button 
                    onClick={() => handleDelete(sub._id)}
                    disabled={isDeleting === sub._id}
                    className="btn-modern btn-outline-danger" 
                    style={{ 
                        padding: '0.4rem 1.2rem', 
                        fontSize: '0.8rem', 
                        background: isDeleting === sub._id ? '#eee' : 'rgba(239, 68, 68, 0.05)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '999px',
                        fontWeight: 700,
                        transition: 'all 0.3s ease'
                    }}
                  >
                    {isDeleting === sub._id ? 'Removing...' : 'Remove User'}
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {subscribers.length === 0 && (
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem', opacity: 0.2, marginBottom: '1rem' }}>✉️</div>
            <p className="text-muted" style={{ fontWeight: 600 }}>Your subscriber list is currently empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}
