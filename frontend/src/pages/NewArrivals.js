import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Force backend to sort by createdAt:desc
    const url = (process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1") + '/products?sort=createdAt:desc&limit=24';
    
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((res) => { 
          // Client side filter: only show items created in the last 7 days
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          
          const recentProducts = (res.products || []).filter(p => {
              if(!p.createdAt) return true; // fallback
              return new Date(p.createdAt) >= sevenDaysAgo;
          });
          
          // If no items in last 7 days, just show latest 12
          setProducts(recentProducts.length > 0 ? recentProducts : (res.products || []).slice(0, 12)); 
      })
      .catch(err => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-5" data-aos="fade-in">
      <div className="mb-5 text-center">
        <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary)', background: 'rgba(254,189,105,0.1)', padding: '5px 15px', borderRadius: '999px' }}>
          Latest Drops
        </span>
        <h1 className="mt-3" style={{ fontWeight: 900, fontSize: '3rem', letterSpacing: '-1px' }}>New Arrivals</h1>
        <p className="text-muted mx-auto mt-2" style={{ maxWidth: '600px' }}>
          Discover the freshest products just added to our catalog. Premium quality, curated for you.
        </p>
      </div>

      {loading ? (
        <div className="row g-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="col-12 col-md-6 col-lg-3">
              <div className="skeleton-card" style={{ height: '350px', borderRadius: 'var(--radius-lg)' }}></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-5">
           <h3 style={{ fontWeight: 800 }}>No New Arrivals In The Last 7 Days</h3>
           <p className="text-muted">Check back later for exciting new products.</p>
           <Link to="/" className="btn-modern btn-primary-modern mt-3">Back to Home</Link>
        </div>
      ) : (
        <div className="row g-4">
          {products.map((product, i) => (
            <motion.div 
                key={product._id} 
                className="col-12 col-sm-6 col-lg-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
            >
              <div style={{ position: 'relative' }}>
                  {/* "NEW" Badge */}
                  <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, background: 'var(--secondary)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 900 }}>
                      JUST ADDED
                  </div>
                  <ProductCard product={product} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
