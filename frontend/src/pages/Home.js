import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Carousel from "../components/Carousel";
import CountUpNumber from "../components/CountUpNumber";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== '') params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  useEffect(() => {
    const keyword = searchParams.get('keyword') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || '';
    const freeDelivery = searchParams.get('freeDelivery') || '';
    let url = (process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1") + '/products?limit=50';
    if (keyword) url += `&keyword=${keyword}`;
    if (category) url += `&category=${category}`;
    if (sort) url += `&sort=${sort}`;
    if (freeDelivery) url += `&freeDelivery=${freeDelivery}`;

    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((res) => { setProducts(res.products || []); })
      .catch(err => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  }, [searchParams]);

  useEffect(() => {
    fetch((process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1") + '/categories')
      .then(res => res.json())
      .then(res => setCategories(res.categories || []))
      .catch(() => {});
  }, []);

  const activeCategory = searchParams.get('category');
  const searchKeyword = searchParams.get('keyword');
  const activeSort = searchParams.get('sort');
  const activeDelivery = searchParams.get('freeDelivery');
  
  const hasFilterActive = activeCategory || searchKeyword || activeSort || activeDelivery;

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const cat = product.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  // Brands marquee with corporate colors
  const brands = [
    { name: 'Apple', color: '#555555' },
    { name: 'Samsung', color: '#1428a0' },
    { name: 'Sony', color: '#000000' },
    { name: 'Nike', color: '#e7352e' },
    { name: 'Adidas', color: '#000000' },
    { name: 'Bose', color: '#000000' },
    { name: 'Dell', color: '#0076ce' },
    { name: 'Logitech', color: '#00b8fc' },
    { name: 'Canon', color: '#cc0000' },
    { name: 'Dyson', color: '#3e0054' },
    { name: 'Gucci', color: '#000000' },
    { name: 'Prada', color: '#000000' }
  ];

  return (
    <>
      {/* 1. Hero Carousel */}
      {!activeCategory && !searchKeyword && !activeSort && <Carousel />}

      {/* 2. Brands Marquee - High Visibility Section */}
      {!activeCategory && !searchKeyword && !activeSort && (
        <section className="brands-marquee-section" data-aos="fade-up">
          <div className="container-fluid py-2">
            <div className="text-center mb-4">
              <span className="brands-title-pill">
                Trusted by the World's Leading Brands
              </span>
            </div>
            <div className="brands-marquee-container">
              <div className="brands-track">
                {[...brands, ...brands].map((brand, i) => (
                  <span key={i} className="brand-item-logo" style={{ color: brand.color }}>
                    {brand.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Products Row Section */}
      <div className="container pb-5 pt-4" style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {categories.length > 0 && (
          <section className="mb-4" data-aos="fade-up">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h3 className="section-title-modern mb-0">Explore Collections</h3>
              {(activeCategory || searchKeyword) && (
                <Link to="/" className="btn-modern" style={{ background: 'rgba(15,23,42,0.05)', color: 'var(--primary)', fontSize: '0.8rem', padding: '0.4rem 1rem', borderRadius: '8px' }}>
                  <i className="fas fa-times mr-2"></i> Clear Selection
                </Link>
              )}
            </div>
            
            <div className="category-scroll-container custom-scrollbar">
              {categories.map((cat, i) => (
                <Link 
                  key={cat._id} 
                  to={`/?category=${encodeURIComponent(cat.name)}`}
                  style={{ textDecoration: 'none' }}
                >
                  <motion.div 
                    className={`category-item-pill ${activeCategory === cat.name ? 'active' : ''}`}
                    whileHover={{ y: -4, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-aos="fade-up"
                    data-aos-delay={i * 50}
                  >
                    <i className={cat.icon || 'fas fa-tag'}></i>
                    {cat.name}
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* New FEATURE: Latest Arrivals - Only show on main landing */}
        {!activeCategory && !searchKeyword && products.length > 0 && (
          <section className="mb-4" data-aos="fade-up">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h3 className="section-title-modern mb-0">Latest Arrivals</h3>
              <Link to="/search?sort=latest" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
                View All <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>
            <div className="row g-3 d-none d-md-flex">
              {products.slice(0, 4).map((product) => (
                <div key={product._id} className="col-md-6 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            {/* Mobile/Tablet Fallback for Latest */}
            <div className="row g-3 d-md-none">
              {products.slice(0, 2).map((product) => (
                <div key={product._id} className="col-6">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Why Choose BuyMe Section */}
        {!activeCategory && !searchKeyword && (
          <section className="mb-4">
            <div className="card-premium py-4 px-5 text-center" data-aos="fade-up" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--secondary)', marginBottom: '1rem', display: 'inline-block' }}>Why Choose BuyMe</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>We're more than a marketplace</h2>
              <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '600px', mx: 'auto', marginLeft: 'auto', marginRight: 'auto' }}>
                We're your trusted partner in premium shopping.
              </p>
              
              <div className="row g-4">
                <div className="col-md-3" data-aos="fade-up" data-aos-delay="100">
                  <div style={{ padding: '0 1rem' }}>
                    <div style={{ width: '60px', height: '60px', margin: '0 auto 1.5rem', background: 'rgba(254,189,105,0.1)', color: 'var(--secondary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
                      <i className="fas fa-bolt"></i>
                    </div>
                    <h5 style={{ fontWeight: 800, marginBottom: '0.75rem', fontSize: '1.1rem' }}>Lightning Delivery</h5>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>Free express shipping on orders over $50. Most orders arrive within 2 business days.</p>
                  </div>
                </div>
                <div className="col-md-3" data-aos="fade-up" data-aos-delay="200">
                  <div style={{ padding: '0 1rem' }}>
                    <div style={{ width: '60px', height: '60px', margin: '0 auto 1.5rem', background: 'rgba(254,189,105,0.1)', color: 'var(--secondary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
                      <i className="fas fa-certificate"></i>
                    </div>
                    <h5 style={{ fontWeight: 800, marginBottom: '0.75rem', fontSize: '1.1rem' }}>100% Authentic</h5>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>Every product is verified for authenticity. We partner directly with premium brands.</p>
                  </div>
                </div>
                <div className="col-md-3" data-aos="fade-up" data-aos-delay="300">
                  <div style={{ padding: '0 1rem' }}>
                    <div style={{ width: '60px', height: '60px', margin: '0 auto 1.5rem', background: 'rgba(254,189,105,0.1)', color: 'var(--secondary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
                      <i className="fas fa-gem"></i>
                    </div>
                    <h5 style={{ fontWeight: 800, marginBottom: '0.75rem', fontSize: '1.1rem' }}>Premium Quality</h5>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>Rigorously curated catalog. Only the finest products make it to our digital shelves.</p>
                  </div>
                </div>
                <div className="col-md-3" data-aos="fade-up" data-aos-delay="400">
                  <div style={{ padding: '0 1rem' }}>
                    <div style={{ width: '60px', height: '60px', margin: '0 auto 1.5rem', background: 'rgba(254,189,105,0.1)', color: 'var(--secondary)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
                      <i className="fas fa-undo"></i>
                    </div>
                    <h5 style={{ fontWeight: 800, marginBottom: '0.75rem', fontSize: '1.1rem' }}>Hassle-Free Returns</h5>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.6' }}>30-day no-questions-asked return policy with complimentary return shipping labels.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 6. Main Product Content Area (Rows/Grid) */}
        <section className="mb-4">
          <div className="row">
            
            {/* Sidebar Filters */}
            <div className="col-lg-3 d-none d-lg-block">
               <div className="card-premium p-4 sticky-top" style={{ top: '100px', zIndex: 1, border: '1px solid rgba(0,0,0,0.05)' }}>
                 <div className="d-flex align-items-center justify-content-between mb-4">
                     <h4 style={{ fontWeight: 800, marginBottom: 0 }}>Filters</h4>
                     {hasFilterActive && (
                         <button onClick={() => setSearchParams({})} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, padding: 0 }}>Clear All</button>
                     )}
                 </div>
                 
                 <div className="filter-group mb-4">
                   <h6 style={{ fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>Sort Options</h6>
                   <div style={{ height: '2px', width: '30px', background: 'var(--primary)', marginBottom: '1rem', marginTop: '0.5rem' }}></div>
                   
                   <div className="form-check custom-radio mb-3" style={{ paddingLeft: 0 }}>
                     <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                       <input type="radio" name="sort" checked={!activeSort} onChange={() => setFilter('sort', '')} style={{ width: '18px', height: '18px', marginRight: '10px', accentColor: 'var(--primary)' }} />
                       <span style={{ fontWeight: !activeSort ? 700 : 500, color: !activeSort ? 'var(--text-main)' : 'var(--text-muted)' }}>Most Relevant</span>
                     </label>
                   </div>
                   <div className="form-check custom-radio mb-3" style={{ paddingLeft: 0 }}>
                     <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                       <input type="radio" name="sort" checked={activeSort === 'price:asc'} onChange={() => setFilter('sort', 'price:asc')} style={{ width: '18px', height: '18px', marginRight: '10px', accentColor: 'var(--primary)' }} />
                       <span style={{ fontWeight: activeSort === 'price:asc' ? 700 : 500, color: activeSort === 'price:asc' ? 'var(--text-main)' : 'var(--text-muted)' }}>Price: Low to High</span>
                     </label>
                   </div>
                   <div className="form-check custom-radio" style={{ paddingLeft: 0 }}>
                     <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                       <input type="radio" name="sort" checked={activeSort === 'price:desc'} onChange={() => setFilter('sort', 'price:desc')} style={{ width: '18px', height: '18px', marginRight: '10px', accentColor: 'var(--primary)' }} />
                       <span style={{ fontWeight: activeSort === 'price:desc' ? 700 : 500, color: activeSort === 'price:desc' ? 'var(--text-main)' : 'var(--text-muted)' }}>Price: High to Low</span>
                     </label>
                   </div>
                 </div>

                 <div className="filter-group">
                   <h6 style={{ fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>Delivery</h6>
                   <div style={{ height: '2px', width: '30px', background: 'var(--primary)', marginBottom: '1rem', marginTop: '0.5rem' }}></div>
                   
                   <div className="form-check custom-checkbox" style={{ paddingLeft: 0 }}>
                     <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                       <input type="checkbox" checked={activeDelivery === 'true'} onChange={(e) => setFilter('freeDelivery', e.target.checked ? 'true' : '')} style={{ width: '18px', height: '18px', marginRight: '10px', accentColor: 'var(--primary)' }} />
                       <span style={{ fontWeight: activeDelivery ? 700 : 600, color: activeDelivery ? 'var(--text-main)' : 'var(--text-muted)' }}>
                           <i className="fas fa-shipping-fast mr-2" style={{ color: activeDelivery ? 'var(--primary)' : '#10b981' }}></i> 
                           Free Delivery
                       </span>
                     </label>
                   </div>
                 </div>
               </div>
            </div>

            {/* Main Products Grid */}
            <div className="col-12 col-lg-9">
                {loading ? (
                  <div className="row g-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="col-6 col-md-4 col-lg-4">
                        <div className="skeleton-card" style={{ height: '350px', borderRadius: 'var(--radius-lg)' }}></div>
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-5" data-aos="fade-up">
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} style={{ fontSize: '4rem', opacity: 0.3, marginBottom: '1rem', color: 'var(--primary)' }}>
                      <i className="fas fa-search"></i>
                    </motion.div>
                    <h3 className="mt-4" style={{ fontWeight: 800 }}>No Products Found</h3>
                    <p className="text-muted mb-4">We couldn't find any products matching your criteria.</p>
                    <button onClick={() => setSearchParams({})} className="btn-modern btn-primary-modern">Clear All Filters</button>
                  </div>
                ) : hasFilterActive ? (
                  /* Flat Grid for active searches & filters */
                  <div className="row g-4" data-aos="fade-up">
                    <div className="col-12 mb-2">
                        <h5 style={{ fontWeight: 800, color: 'var(--text-main)' }}>Showing {products.length} Results</h5>
                    </div>
                    {products.map(product => (
                      <div key={product._id} className="col-6 col-md-4 col-lg-4">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Grouped Grid for landing page default view */
                  <div className="category-product-rows">
                    {categories.map((cat) => {
                      const catProducts = products.filter(p => p.category === cat.name);
                      if (catProducts.length === 0) return null;
                      return (
                        <div key={cat.name} className="mb-5 pb-3" data-aos="fade-up" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                          <div className="d-flex align-items-center justify-content-between mb-4">
                            <h3 style={{ fontWeight: 900, marginBottom: 0, textTransform: 'capitalize' }}>
                              <i className={cat.icon + " mr-2"} style={{ color: 'var(--secondary)' }}></i> {cat.name}
                            </h3>
                            <Link to={`/?category=${encodeURIComponent(cat.name)}`} style={{ fontWeight: 700, color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                              View All <i className="fas fa-arrow-right ml-1"></i>
                            </Link>
                          </div>
                          <div className="row g-3">
                            {catProducts.slice(0, 4).map((product) => (
                              <div key={product._id} className="col-6 col-md-4 col-lg-3">
                                <ProductCard product={product} />
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>

          </div>
        </section>
      </div>
    </>
  );
}
