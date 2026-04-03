import { useEffect, useState } from 'react';
import API from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminDashboard.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', price: '', deliveryCharge: 0, description: '', category: '', seller: '', stock: '', images: null
  });

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data.products || []);
    } catch (error) {
      console.error('Failed to load products', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data.categories || []);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const handleChange = (e) => {
    if (e.target.name === 'images') {
      setForm({ ...form, images: e.target.files });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const openAddModal = () => {
    setEditProduct(null);
    setForm({ name: '', price: '', deliveryCharge: 0, description: '', category: '', seller: '', stock: '', images: null });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name, price: product.price, deliveryCharge: product.deliveryCharge || 0, description: product.description,
      category: product.category || '', seller: product.seller || '', stock: product.stock || '', images: null
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (key === 'images' && form.images) {
        for (let i = 0; i < form.images.length; i++) {
          formData.append('images', form.images[i]);
        }
      } else if (key !== 'images') {
        formData.append(key, form[key]);
      }
    });

    try {
      if (editProduct) {
        await API.put(`/admin/products/${editProduct._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
        toast.success('Product updated!');
      } else {
        await API.post('/admin/products', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
        toast.success('Product created!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await API.delete(`/admin/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '4px solid rgba(115,21,46,0.1)', borderTopColor: 'var(--primary)', animation: 'rotate-slow 1s linear infinite' }}></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Loading products...</p>
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4" data-aos="fade-down">
        <h2 className="page-title">Product Management</h2>
        <motion.button 
          className="btn-modern btn-primary-modern"
          onClick={openAddModal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-plus mr-2"></i> Add Product
        </motion.button>
      </div>

      <div className="activity-table" data-aos="fade-up">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => {
              const imgSrc = (() => {
                const img = product.images?.[0];
                const path = img?.image || img?.url || (typeof img === 'string' ? img : '');
                if (path.startsWith('/uploads')) {
                  return (process.env.REACT_APP_API_URL || "http://localhost:8000").split('/api')[0] + path;
                }
                return path || '/images/products/1.jpg';
              })();

              return (
                <motion.tr 
                  key={product._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, type: "spring", stiffness: 300 }}
                >
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img src={imgSrc} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'contain', background: '#f8f9fa', borderRadius: '12px', padding: '4px' }} />
                      <div>
                        <span style={{ fontWeight: 700, display: 'block' }}>{product.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{product.seller}</span>
                      </div>
                    </div>
                  </td>
                  <td className="gradient-text" style={{ fontWeight: 800, fontSize: '1.1rem' }}>${product.price}</td>
                  <td>
                    <span className={`status-chip ${product.stock > 0 ? 'active' : 'blocked'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td>
                    <span style={{ background: 'rgba(115,21,46,0.06)', padding: '4px 12px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>
                      {product.category || 'General'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <motion.button 
                        className="btn-modern" 
                        style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={() => openEditModal(product)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <i className="fas fa-pen"></i>
                      </motion.button>
                      <motion.button 
                        className="btn-modern" 
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={() => handleDelete(product._id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <i className="fas fa-trash"></i>
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem', opacity: 0.3, marginBottom: '0.5rem' }}>📦</div>
            <p className="empty-text" style={{ padding: 0 }}>No products found. Add your first product!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              className="modal-content-modern"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{editProduct ? '✏️ Edit Product' : '✨ Add New Product'}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group-modern">
                  <label className="form-label-modern">Product Name</label>
                  <input name="name" className="form-input-modern" value={form.name} onChange={handleChange} required placeholder="Enter product name" />
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group-modern">
                      <label className="form-label-modern">Price ($)</label>
                      <input name="price" type="number" className="form-input-modern" value={form.price} onChange={handleChange} required placeholder="29.99" />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group-modern">
                      <label className="form-label-modern">Delivery ($)</label>
                      <input name="deliveryCharge" type="number" step="0.01" className="form-input-modern" value={form.deliveryCharge} onChange={handleChange} required placeholder="0 for free" />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group-modern">
                      <label className="form-label-modern">Stock</label>
                      <input name="stock" type="number" className="form-input-modern" value={form.stock} onChange={handleChange} required placeholder="100" />
                    </div>
                  </div>
                </div>
                <div className="form-group-modern">
                  <label className="form-label-modern">Category</label>
                  <select name="category" className="form-input-modern" value={form.category} onChange={handleChange} required>
                    <option value="">Select a category...</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat.name}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group-modern">
                  <label className="form-label-modern">Seller</label>
                  <input name="seller" className="form-input-modern" value={form.seller} onChange={handleChange} placeholder="Seller name" />
                </div>
                <div className="form-group-modern">
                  <label className="form-label-modern">Description</label>
                  <textarea name="description" className="form-input-modern" value={form.description} onChange={handleChange} rows="3" placeholder="Describe your product..."></textarea>
                </div>
                <div className="form-group-modern">
                  <label className="form-label-modern">Product Images</label>
                  <input name="images" type="file" className="form-input-modern" onChange={handleChange} multiple accept="image/*" style={{ paddingTop: '0.5rem' }} />
                </div>
                <div className="d-flex justify-content-end gap-3 mt-4">
                  <button type="button" className="btn-modern" style={{ background: '#f1f5f9', color: 'var(--text-main)', fontWeight: 700 }} onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-modern btn-primary-modern btn-shimmer">
                    <i className={`fas ${editProduct ? 'fa-save' : 'fa-plus'} mr-2`}></i>
                    {editProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
