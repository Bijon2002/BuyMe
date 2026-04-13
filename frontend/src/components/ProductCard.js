import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axiosConfig';
import { toast } from 'react-toastify';

export default function ProductCard({ product, index = 0 }) {
  const ratingWidth = (product.ratings / 5) * 100;

  const handleFavorite = async (e) => {
      e.preventDefault();
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

  // Determine badge
  const getBadge = () => {
    if (product.stock === 0) return { text: 'Sold Out', className: 'badge-hot' };
    if (product.stock <= 5) return { text: 'Low Stock', className: 'badge-sale' };
    if (index < 4) return { text: 'Featured', className: 'badge-new' };
    return null;
  };

  const badge = getBadge();

  return (
    <div data-aos="fade-up" data-aos-delay={Math.min(index * 80, 400)} data-aos-duration="600" style={{ height: '100%' }}>
      <motion.div 
          className="card-premium product-card d-flex flex-column"
          style={{ height: '100%' }}
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="product-image-container position-relative">
          {/* Badge */}
          {badge && (
            <span className={`product-badge ${badge.className}`}>{badge.text}</span>
          )}

          {/* Floating Favorite Button */}
          <motion.button 
             onClick={handleFavorite} 
             className="btn btn-light position-absolute shadow-sm" 
             style={{ top: '10px', right: '10px', zIndex: 10, borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
             title="Add to Favorites"
             whileHover={{ scale: 1.2 }}
             whileTap={{ scale: 0.85 }}
          >
              <i className="fa fa-heart" style={{ color: 'var(--primary)' }}></i>
          </motion.button>

          <img
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
            loading="lazy"
          />
          

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

          <div className="d-flex align-items-center justify-content-between mt-4">
            <div>
              <p className="product-price-modern mb-0">${product.price}</p>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: product.deliveryCharge > 0 ? 'var(--text-muted)' : '#10b981', marginTop: '2px' }}>
                <i className={`fas ${product.deliveryCharge > 0 ? 'fa-truck' : 'fa-shipping-fast'} mr-1`}></i>
                {product.deliveryCharge > 0 ? `+$${product.deliveryCharge} Delivery` : 'Free Delivery'}
              </div>
            </div>
            <Link to={`/product/${product._id}`} className="btn-modern btn-primary-modern shadow-sm btn-shimmer" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                View <i className="fas fa-arrow-right" style={{ marginLeft: '0.3rem', fontSize: '0.75rem' }}></i>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}