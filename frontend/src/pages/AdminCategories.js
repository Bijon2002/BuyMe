import { useEffect, useState } from 'react';
import API from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminDashboard.css';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', icon: '📦' });

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/admin/categories');
      setCategories(data.categories || []);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCat) {
        await API.put(`/admin/categories/${editCat._id}`, form);
        toast.success('Category updated!');
      } else {
        await API.post('/admin/categories', form);
        toast.success('Category created!');
      }
      setShowForm(false);
      setEditCat(null);
      setForm({ name: '', description: '', icon: '📦' });
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await API.delete(`/admin/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) { toast.error('Failed to delete'); }
  };

  const openEdit = (cat) => {
    setEditCat(cat);
    setForm({ name: cat.name, description: cat.description, icon: cat.icon });
    setShowForm(true);
  };

  if (loading) return (
    <div className="loading-container">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '4px solid rgba(115,21,46,0.1)', borderTopColor: 'var(--primary)', animation: 'rotate-slow 1s linear infinite' }}></div>
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4" data-aos="fade-down">
        <h2 className="page-title">Category Management</h2>
        <motion.button 
          className="btn-modern btn-primary-modern"
          onClick={() => { setEditCat(null); setForm({ name: '', description: '', icon: '📦' }); setShowForm(true); }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-plus mr-2"></i> Add Category
        </motion.button>
      </div>

      {/* Inline Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            className="admin-table-container mb-4 p-4"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
          >
            <h4 className="mb-3" style={{ fontWeight: 800 }}>{editCat ? '✏️ Edit Category' : '✨ New Category'}</h4>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-1">
                  <div className="form-group-modern">
                    <label className="form-label-modern">Icon</label>
                    <input className="form-input-modern text-center" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} style={{ fontSize: '1.5rem', padding: '0.5rem' }} />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group-modern">
                    <label className="form-label-modern">Name</label>
                    <input className="form-input-modern" placeholder="e.g. Electronics" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="form-group-modern">
                    <label className="form-label-modern">Description</label>
                    <input className="form-input-modern" placeholder="Short description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                  </div>
                </div>
                <div className="col-md-2 d-flex align-items-end gap-2 pb-3">
                  <button type="submit" className="btn-modern btn-primary-modern flex-grow-1" style={{ padding: '0.6rem' }}>
                    <i className={`fas ${editCat ? 'fa-save' : 'fa-plus'}`}></i>
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditCat(null); }} className="btn-modern" style={{ background: '#f1f5f9', color: 'var(--text-muted)', padding: '0.6rem' }}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Grid */}
      <div className="row g-3" data-aos="fade-up">
        {categories.map((cat, i) => (
          <div key={cat._id} className="col-md-6 col-lg-4">
            <motion.div 
              className="feature-card h-100 d-flex flex-column" 
              style={{ textAlign: 'left', padding: '1.5rem' }}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                  <h5 className="mt-2 mb-1" style={{ fontWeight: 800 }}>{cat.name}</h5>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{cat.description}</p>
                </div>
                <div className="d-flex gap-2">
                  <motion.button onClick={() => openEdit(cat)} className="btn-modern" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} whileHover={{ scale: 1.1 }}>
                    <i className="fas fa-pen"></i>
                  </motion.button>
                  <motion.button onClick={() => handleDelete(cat._id)} className="btn-modern" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} whileHover={{ scale: 1.1 }}>
                    <i className="fas fa-trash"></i>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-5">
          <div style={{ fontSize: '3rem', opacity: 0.3 }}>📂</div>
          <p className="text-muted mt-2">No categories yet. Add your first one!</p>
        </div>
      )}
    </div>
  );
}
