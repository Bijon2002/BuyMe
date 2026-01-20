import { useEffect, useState } from 'react';
import API from '../api/axiosConfig';
import './AdminDashboard.css';
import { toast } from 'react-toastify';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
 



  // Modal state
  const [editProduct, setEditProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    images: [] // array of strings (URLs or base64)
  });
   const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/products');
      setProducts(res.data.products);
    } catch (error) {
      console.error('Failed to load products', error);
      toast.error('Failed to fetch products', { position: 'top-center', autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted successfully!', { position: 'top-center', autoClose: 2000 });
      fetchProducts();
    } catch (error) {
      console.error('Delete failed', error);
      toast.error('Failed to delete product', { position: 'top-center', autoClose: 2000 });
    }
  };

  // Open edit modal
  const openEditModal = (product) => {
    setEditProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category || '',
      description: product.description || '',
      images: product.images || []
    });
    setShowModal(true);
  };

  // Open add modal
  const openAddModal = () => {
    setEditProduct(null);
    setFormData({ name: '', price: '', stock: '', category: '', description: '', images: [] });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditProduct(null);
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload
const handleImageUpload = (e) => {
  const files = Array.from(e.target.files);

  setFormData({ ...formData, images: files });

  const previews = files.map(file => URL.createObjectURL(file));
  setImagePreviews(previews);
};



  // Submit add product
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/products', formData);
      toast.success('Product added successfully!', { position: 'top-center', autoClose: 2000 });
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error('Add failed', error);
      toast.error('Failed to add product', { position: 'top-center', autoClose: 2000 });
    }
  };

  // Submit update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/products/${editProduct._id}`, formData);
      toast.success('Product updated successfully!', { position: 'top-center', autoClose: 2000 });
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error('Update failed', error);
      toast.error('Failed to update product', { position: 'top-center', autoClose: 2000 });
    }
  };

  if (loading) return <p className="loading-text">Loading products...</p>;

  return (
    <div className="admin-page">
      <h2 className="page-title">Product Management</h2>

      {/* Add Product Button */}
      <button className="success-btn add-btn" onClick={openAddModal}>+ Add Product</button>

      {/* Product Table */}
      <div className="activity-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((prod) => (
              <tr key={prod._id}>
                <td>{prod.name}</td>
                <td>${prod.price}</td>
                <td>{prod.stock}</td>
                <td>
                  <span className={`status-chip ${prod.stock > 0 ? 'active' : 'blocked'}`}>
                    {prod.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  <button className="edit-btn" onClick={() => openEditModal(prod)}>Edit</button>
                  <button className="danger-btn" onClick={() => handleDelete(prod._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="empty-text">No products found.</p>}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editProduct ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={editProduct ? handleUpdate : handleAdd}>
              <label>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </label>
              <label>
                Price:
                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
              </label>
              <label>
                Stock:
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
              </label>
              <label>
                Category:
                <input type="text" name="category" value={formData.category} onChange={handleChange} />
              </label>
              <label>
                Description:
                <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
              </label>
              <label>
                Images:
                <input type="file" multiple onChange={handleImageUpload} />
              </label>
              {formData.images.length > 0 && (
                <div className="image-preview">
                  {formData.images.map((img, idx) => (
                    <img key={idx} src={img} alt="Preview" width="60" />
                  ))}
                </div>
              )}
              <div className="modal-actions">
                <button type="submit" className="success-btn">{editProduct ? 'Update' : 'Add'}</button>
                <button type="button" className="danger-btn" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
