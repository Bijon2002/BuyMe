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
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile Upload State
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
              localStorage.setItem('userInfo', JSON.stringify(data.data)); // Update local storage
              setUser(data.data);
              setProfilePicFile(null);
              window.location.reload(); // Quick refresh header
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
              fetchUserProfile(); // Refresh list
          }
      } catch (error) {
          toast.error('Failed to remove favorite');
      }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <img src="/images/loader.gif" alt="Loading..." style={{ width: '80px' }} />
      </div>
    );
  }

  const picUrl = previewPic 
      ? previewPic 
      : (user?.profilePic?.startsWith('/uploads') 
          ? (process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1").split('/api')[0] + user.profilePic 
          : user?.profilePic);

  return (
    <div className="admin-dashboard-container animate-fade-in" style={{ minHeight: '90vh', padding: '0 1rem 4rem 1rem' }}>
        <div className="max-w-7xl mx-auto">
            
            {/* Top Profile Banner & Info */}
            <div className="user-profile-header shadow-sm position-relative">
                <div className="profile-banner"></div>
                
                {/* Logout button top right corner */}
                <button 
                   onClick={handleLogout} 
                   className="btn btn-light position-absolute shadow-sm" 
                   style={{ top: '20px', right: '20px', borderRadius: '50px', fontWeight: 'bold', zIndex: 10, padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <i className="fa fa-sign-out text-danger"></i> Logout
                </button>

                <div className="d-flex flex-column align-items-center text-center px-4 pb-4">
                    <div className="position-relative d-inline-block profile-avatar-wrapper">
                        {picUrl ? (
                            <img src={picUrl} alt="Profile" className="rounded-circle shadow" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                        ) : (
                            <div className="rounded-circle d-inline-flex align-items-center justify-content-center shadow" style={{ width: '150px', height: '150px', background: 'var(--secondary)' }}>
                                <span className="text-white" style={{ fontWeight: 'bold', fontSize: '4rem' }}>{user?.name?.charAt(0).toUpperCase()}</span>
                            </div>
                        )}
                        <label className="profile-edit-btn position-absolute text-white" style={{ background: 'var(--primary)' }} title="Change Profile Picture">
                            <i className="fa fa-camera"></i>
                            <input type="file" hidden onChange={handlePicChange} accept="image/*" />
                        </label>
                    </div>
                    
                    {profilePicFile && (
                        <div className="mt-3">
                            <button onClick={uploadProfilePic} disabled={uploadingInfo} className="btn-modern btn-primary-modern shadow" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                                {uploadingInfo ? <><i className="fa fa-spinner fa-spin mr-2"></i>Saving...</> : <><i className="fa fa-save mr-2"></i>Save Picture</>}
                            </button>
                        </div>
                    )}

                    <h2 className="mt-3 mb-1" style={{ fontWeight: 800, color: 'var(--secondary)' }}>{user?.name}</h2>
                    <p className="text-muted mb-2">{user?.email}</p>
                    <span className="stock-indicator in-stock mb-1 d-inline-block">Verified Account</span>

                    {/* Horizontal Tabs */}
                    <div className="profile-tabs d-flex justify-content-center flex-wrap gap-2 w-100">
                        <button onClick={() => setActiveTab('profile')} className={`profile-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}>
                            <i className="fa fa-user"></i> My Profile
                        </button>
                        <button onClick={() => setActiveTab('orders')} className={`profile-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}>
                            <i className="fa fa-shopping-bag"></i> Orders ({orders.length})
                        </button>
                        <button onClick={() => setActiveTab('favorites')} className={`profile-tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}>
                            <i className="fa fa-heart"></i> Favorites ({user?.favorites?.length || 0})
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area Below Tabs */}
            <div className="mt-4">
                <AnimatePresence mode="wait">
                    
                    {/* PROFILE TAB */}
                    {activeTab === 'profile' && (
                        <motion.div key="profile" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}>
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="stat-card">
                                        <div className="stat-icon" style={{ background: 'rgba(56, 161, 105, 0.1)', color: '#38a169' }}>
                                            <i className="fa fa-shield"></i>
                                        </div>
                                        <div>
                                            <p className="stat-title">Status</p>
                                            <h3 className="stat-value">{user?.isActive ? 'Active' : 'Restricted'}</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="stat-card">
                                        <div className="stat-icon" style={{ background: 'rgba(115, 21, 46, 0.1)', color: 'var(--maroon)' }}>
                                            <i className="fa fa-calendar"></i>
                                        </div>
                                        <div>
                                            <p className="stat-title">Member Since</p>
                                            <h3 className="stat-value" style={{ fontSize: '1.4rem' }}>
                                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ORDERS TAB */}
                    {activeTab === 'orders' && (
                        <motion.div key="orders" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }} className="card-premium p-4">
                            <h3 className="mb-4" style={{ fontWeight: 800 }}>Order History</h3>
                            {orders.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="fa fa-shopping-cart mb-3" style={{ fontSize: '3rem', opacity: 0.2 }}></i>
                                    <h4 className="mb-2">No Orders Yet</h4>
                                    <p>Looks like you haven't made any purchases.</p>
                                    <Link to="/" className="btn-modern btn-primary-modern mt-3">Start Shopping</Link>
                                </div>
                            ) : (
                                <div className="table-responsive admin-table-container">
                                    <table className="table mt-3 align-middle">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Date</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order, i) => (
                                                <tr key={order._id} style={{ animationDelay: `${i * 0.1}s` }} className="fadeInRow">
                                                    <td style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>#{order._id.substring(0, 8).toUpperCase()}</td>
                                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td style={{ fontWeight: 800, color: 'var(--maroon)' }}>${Number(order.amount).toFixed(2)}</td>
                                                    <td>
                                                        <span className={`stock-indicator ${order.status === 'Delivered' ? 'in-stock' : 'out-of-stock'}`}>
                                                            {order.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <Link to={`/order/${order._id}`} className="btn btn-sm btn-outline-secondary rounded-pill fw-bold" style={{ padding: '0.4rem 1rem' }}>View</Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* FAVORITES TAB */}
                    {activeTab === 'favorites' && (
                        <motion.div key="favorites" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}>
                            {!user?.favorites || user.favorites.length === 0 ? (
                                <div className="card-premium p-4 text-center py-5 text-muted">
                                    <i className="fa fa-heart-o mb-3" style={{ fontSize: '3rem', opacity: 0.2 }}></i>
                                    <h4 className="mb-2">Your Wishlist is Empty</h4>
                                    <p>Save items you love to your wishlist to keep track of them.</p>
                                    <Link to="/" className="btn-modern btn-primary-modern mt-3">Explore Products</Link>
                                </div>
                            ) : (
                                <div className="row g-4">
                                    {user.favorites.map((product) => {
                                        if (typeof product === 'string') return null;
                                        return (
                                            <div key={product._id} className="col-md-6 col-lg-4">
                                                <div className="favorite-card p-3 position-relative d-flex flex-column h-100">
                                                    <button onClick={() => removeFavorite(product._id)} className="btn btn-light shadow-sm position-absolute" style={{ top: '10px', right: '10px', zIndex: 10, borderRadius: '50%', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }} title="Remove">
                                                        <i className="fa fa-trash text-danger"></i>
                                                    </button>
                                                    
                                                    <div className="d-flex justify-content-center mb-3">
                                                        <img 
                                                            src={(() => {
                                                                const img = product.images?.[0];
                                                                const path = img?.image || img?.url || "/images/products/1.jpg";
                                                                if (path.startsWith('/uploads')) {
                                                                    return (process.env.REACT_APP_API_URL || "http://localhost:8000").split('/api')[0] + path;
                                                                }
                                                                return path;
                                                            })()}
                                                            alt={product.name}
                                                            style={{ height: '150px', objectFit: 'contain' }}
                                                        />
                                                    </div>
                                                    
                                                    <div className="mt-auto text-center px-2">
                                                        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'var(--text)' }}>
                                                            <h5 className="mb-1 text-truncate" style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{product.name}</h5>
                                                        </Link>
                                                        <p className="mb-3" style={{ color: 'var(--maroon)', fontWeight: 800, fontSize: '1.25rem' }}>${product.price}</p>
                                                        <Link to={`/product/${product._id}`} className="btn-modern btn-primary-modern w-100 py-2 d-inline-block" style={{ fontSize: '0.9rem' }}>
                                                            View Product
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    </div>
  );
}