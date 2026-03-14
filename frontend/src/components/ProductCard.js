import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axiosConfig';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const ratingWidth = (product.ratings / 5) * 100;

  const handleFavorite = async (e) => {
      e.preventDefault(); // Prevent navigating to product detail
      try {
          const { data } = await API.post(`/auth/favorites/${product._id}`);
          if (data.success) {
              toast.success(data.message);
          }
      } catch (error) {
          if (error.response?.status === 401) {
              toast.error("Please login to favorite items");
          } else {
              toast.error("Failed to update favorites");
          }
      }
  };

  return (
    <motion.div 
        className="card-premium product-card d-flex flex-column"
        whileHover={{ y: -10, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
    >
      <div className="product-image-container position-relative">
        {/* Floating Favorite Button */}
        <button 
           onClick={handleFavorite} 
           className="btn btn-light position-absolute shadow" 
           style={{ top: '10px', right: '10px', zIndex: 10, borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}
           title="Add to Favorites"
        >
            <i className="fa fa-heart" style={{ color: 'var(--maroon)' }}></i>
        </button>

        <motion.img
          src={(() => {
            const img = product.images[0];
            const pathValue = img ? (img.url || img.image || (typeof img === 'string' ? img : "")) : "";
            const cleanPath = typeof pathValue === 'string' ? pathValue : "";
            if (cleanPath.startsWith('/uploads')) {
               const baseUrl = (process.env.REACT_APP_API_URL || "http://localhost:8000").split('/api')[0];
               return baseUrl + cleanPath;
            }
            return cleanPath || "/images/products/1.jpg";
          })()}
          alt={product.name}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Floating View Details Button */}
        <motion.div 
            className="product-overlay-actions"
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
        >
            <Link to={`/product/${product._id}`} className="btn-modern btn-primary-modern shadow">
                View Details
            </Link>
        </motion.div>
      </div>
      <div className="product-info-modern d-flex flex-column flex-grow-1">
        <div className="product-category-modern">{product.category || 'Electronics'}</div>
        <Link to={"/product/" + product._id} style={{ textDecoration: 'none' }}>
          <h5 className="product-title-modern">{product.name}</h5>
        </Link>

        <div className="stars-modern mt-auto">
          <div className="rating-outer">
            <div className="rating-inner" style={{ width: `${ratingWidth}%` }}></div>
          </div>
          {product.numOfReviews > 0 && (
            <span id="no_of_reviews" style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              ({product.numOfReviews})
            </span>
          )}
        </div>

        <div className="d-flex align-items-center justify-content-between mt-3">
          <p className="product-price-modern mb-0">${product.price}</p>
        </div>
      </div>
    </motion.div>
  );
}