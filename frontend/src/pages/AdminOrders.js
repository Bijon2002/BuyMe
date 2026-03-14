import { useEffect, useState } from 'react';
import API from '../api/axiosConfig';
import './AdminDashboard.css';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders');
      setOrders(res.data.orders);
    } catch (error) {
      console.error('Failed to load orders', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.patch(`/order/${id}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return (
    <div className="loading-container">
      <img src="/images/loader.gif" alt="Loading..." className="loader-img" />
    </div>
  );

  return (
    <div className="admin-page">
      <h2 className="page-title">Order Management</h2>
      <div className="activity-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <motion.tbody
            initial="hidden"
            animate="show"
            variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {orders.map((order, idx) => (
              <motion.tr 
                 key={order._id}
                 variants={{
                     hidden: { opacity: 0, x: -20 },
                     show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300 } }
                 }}
                 custom={idx}
              >
                <td style={{ fontSize: '0.8rem' }}>{order._id}</td>
                <td>${order.amount}</td>
                <td>
                  <span className={`status-chip ${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="status-select admin-input"
                    style={{ width: 'auto', padding: '8px 12px' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
        {orders.length === 0 && <p className="empty-text">No orders found.</p>}
      </div>
    </div>
  );
}
