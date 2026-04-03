import { useEffect, useState } from 'react';
import API from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminDashboard.css';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchContacts = async () => {
    try {
      const res = await API.get('/contact');
      setContacts(res.data.contacts || []);
    } catch (error) {
      console.error('Failed to load contacts', error);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return toast.warning('Please enter a reply message');
    
    setIsSubmitting(true);
    try {
      await API.post(`/contact/reply/${selectedContact._id}`, { replyMessage: replyText });
      toast.success('Reply sent successfully!');
      setSelectedContact(null);
      setReplyText('');
      fetchContacts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '4px solid rgba(115,21,46,0.1)', borderTopColor: 'var(--primary)', animation: 'rotate-slow 1s linear infinite' }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Loading inquiries...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4" data-aos="fade-down">
        <h2 className="page-title">Customer Inquiries</h2>
        <div className="d-flex gap-3">
            <span style={{ background: 'rgba(115,21,46,0.06)', padding: '8px 16px', borderRadius: '999px', fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem' }}>
              {contacts.filter(c => !c.isReplied).length} new messages
            </span>
        </div>
      </div>

      <div className="product-table-wrapper" data-aos="fade-up">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, i) => (
              <motion.tr
                key={contact._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{contact.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{contact.email}</span>
                  </div>
                </td>
                <td style={{ maxWidth: '250px' }}>
                  <div style={{ fontWeight: 600 }}>{contact.subject}</div>
                  <div className="text-truncate" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '100%' }}>{contact.message}</div>
                </td>
                <td>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${contact.isReplied ? 'status-delivered' : 'status-pending'}`}>
                    {contact.isReplied ? 'Replied' : 'Pending'}
                  </span>
                </td>
                <td>
                  {!contact.isReplied ? (
                    <button 
                        onClick={() => setSelectedContact(contact)}
                        className="btn-modern btn-primary-modern" 
                        style={{ padding: '0.4rem 1.2rem', fontSize: '0.8rem' }}
                    >
                        Reply
                    </button>
                  ) : (
                    <button className="btn-modern disabled" style={{ padding: '0.4rem 1.2rem', fontSize: '0.8rem', opacity: 0.5, cursor: 'default' }}>
                        Done
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {contacts.length === 0 && (
          <div className="text-center py-5">
            <i className="fas fa-inbox mb-3" style={{ fontSize: '3rem', opacity: 0.2 }}></i>
            <p className="text-muted" style={{ fontWeight: 600 }}>No inquiries found.</p>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {selectedContact && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div 
              className="card-premium p-4" 
              style={{ width: '100%', maxWidth: '600px', background: 'white' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 style={{ fontWeight: 900, marginBottom: 0 }}>Reply to Ticket</h3>
                <button onClick={() => setSelectedContact(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: 'var(--text-muted)' }}>&times;</button>
              </div>

              <div className="mb-4 p-3" style={{ background: '#f8fafc', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', marginBottom: '0.5rem' }}>Original Message from {selectedContact.name}</p>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', margin: 0, fontStyle: 'italic' }}>"{selectedContact.message}"</p>
              </div>

              <form onSubmit={handleReply}>
                <div className="mb-4">
                    <label className="form-label-premium">Your Premium Response</label>
                    <textarea 
                        className="form-input-premium w-100" 
                        rows="6" 
                        placeholder="Write your response here..." 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        required
                        style={{ background: '#fff', border: '1px solid #cbd5e1' }}
                    ></textarea>
                </div>
                <div className="d-flex gap-3">
                    <button type="button" onClick={() => setSelectedContact(null)} className="btn-modern w-100" style={{ background: '#f1f5f9', color: 'var(--text-main)' }}>Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="btn-modern btn-primary-modern w-100">
                        {isSubmitting ? 'Sending...' : 'Send Reply'}
                    </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
