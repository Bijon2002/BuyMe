import { useEffect, useState } from 'react';
import API from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import './AdminDashboard.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/admin/orders');
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/admin/orders/${id}`, { status });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '4px solid rgba(115,21,46,0.1)', borderTopColor: 'var(--primary)', animation: 'rotate-slow 1s linear infinite' }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Loading orders...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4" data-aos="fade-down">
        <h2 className="page-title">Order Management</h2>
        <span style={{ background: 'rgba(115,21,46,0.06)', padding: '8px 16px', borderRadius: '999px', fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
          {orders.length} total orders
        </span>
      </div>

      <div className="activity-table" data-aos="fade-up">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 300 }}
              >
                <td className="order-id-cell">#{order._id.substring(0,8).toUpperCase()}</td>
                <td>
                  <div>
                    <span style={{ fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <br/>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: 600 }}>{order.CartItems?.length || 0} items</span>
                </td>
                <td>
                  <span className="gradient-text" style={{ fontWeight: 800, fontSize: '1.1rem' }}>${Number(order.amount).toFixed(2)}</span>
                </td>
                <td>
                  <span className={`status-badge status-${(order.status || 'pending').toLowerCase()}`}>
                    {order.status || 'Pending'}
                  </span>
                </td>
                <td>
                  <select
                    value={order.status || 'Pending'}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: '999px',
                      border: '2px solid #e2e8f0',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: 'white',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      color: 'var(--text-main)',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '0.5rem' }}>🛒</div>
            <p className="empty-text" style={{ padding: 0 }}>No orders received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
