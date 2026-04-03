import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";

export default function ProductDetail({ cartItems, setCartItems }) {
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [addedToCart, setAddedToCart] = useState(false);
    const [similarProducts, setSimilarProducts] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        setAddedToCart(false);
        setQty(1);
        window.scrollTo(0, 0);

        fetch(`${process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1"}/products/${id}`)
            .then((res) => res.json())
            .then((res) => {
                setProduct(res.product);
                // Fetch similar products
                if (res.product?.category) {
                    fetch(`${process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1"}/products?category=${encodeURIComponent(res.product.category)}&limit=5`)
                        .then(r => r.json())
                        .then(r => {
                            const filtered = (r.products || []).filter(p => p._id !== id);
                            setSimilarProducts(filtered.slice(0, 4));
                        })
                        .catch(() => {});
                }
            })
            .catch(err => { console.error(err); toast.error("Failed to load product"); })
            .finally(() => setLoading(false));
    }, [id]);

    function addToCart() {
        const itemExists = cartItems.find((item) => item.product._id === product._id);
        if (!itemExists) {
            const newItem = { product, qty };
            setCartItems([...cartItems, newItem]);
            setAddedToCart(true);
            toast.success("Added to cart!");
        } else {
            toast.info("Item already in cart");
        }
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                <div className="d-flex flex-column align-items-center">
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '4px solid rgba(15,23,42,0.1)', borderTopColor: 'var(--primary)', animation: 'rotate-slow 1s linear infinite' }}></div>
                    <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-5">
                <div style={{ fontSize: '4rem', opacity: 0.2, marginBottom: '1rem', color: 'var(--primary)' }}><i className="fas fa-search"></i></div>
                <h2 style={{ fontWeight: 800 }}>Product Not Found</h2>
                <p className="text-muted mb-3">The product you're looking for doesn't exist or has been removed.</p>
                <Link to="/" className="btn-modern btn-primary-modern">Back to Shop</Link>
            </div>
        );
    }

    const imgSrc = (() => {
        const img = product.images?.[0];
        const path = img?.image || img?.url || (typeof img === 'string' ? img : '');
        if (path.startsWith('/uploads')) {
            return (process.env.REACT_APP_API_URL || "http://localhost:8000").split('/api')[0] + path;
        }
        return path || '/images/products/1.jpg';
    })();

    const inStock = Number(product.stock) > 0;

    return (
        <div>
            {/* Breadcrumb */}
            <nav className="mb-4" data-aos="fade-right" style={{ fontSize: '0.85rem' }}>
                <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
                <span className="mx-2" style={{ color: 'var(--text-muted)' }}>/</span>
                {product.category && (
                    <>
                        <Link to={`/?category=${encodeURIComponent(product.category)}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>{product.category}</Link>
                        <span className="mx-2" style={{ color: 'var(--text-muted)' }}>/</span>
                    </>
                )}
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{product.name}</span>
            </nav>

            <div className="row g-5">
                {/* Product Image */}
                <div className="col-lg-6" data-aos="fade-right">
                    <motion.div 
                        className="card-premium d-flex justify-content-center align-items-center overflow-hidden"
                        style={{ padding: '3rem', background: '#fafafa', minHeight: '450px' }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <motion.img 
                            src={imgSrc} 
                            alt={product.name} 
                            style={{ maxHeight: '400px', maxWidth: '100%', objectFit: 'contain' }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        />
                    </motion.div>
                </div>

                {/* Product Info */}
                <div className="col-lg-6" data-aos="fade-left">
                    {product.category && (
                        <Link to={`/?category=${encodeURIComponent(product.category)}`} style={{ textDecoration: 'none' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', background: 'rgba(15,23,42,0.06)', padding: '4px 12px', borderRadius: '999px' }}>
                                {product.category}
                            </span>
                        </Link>
                    )}

                    <h1 className="mt-3 mb-2" style={{ fontWeight: 900, fontSize: '2rem', lineHeight: 1.2 }}>{product.name}</h1>
                    
                    {product.seller && (
                        <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                            by <strong style={{ color: 'var(--text-main)' }}>{product.seller}</strong>
                        </p>
                    )}

                    {/* Rating */}
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <div className="d-flex">
                            {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fa${i < Math.floor(Number(product.ratings) || 0) ? 's' : 'r'} fa-star`} style={{ color: '#fbbf24', fontSize: '1rem' }}></i>
                            ))}
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                            {product.ratings || '0'} ({product.numOfReviews || '0'} reviews)
                        </span>
                    </div>

                    <div className="mb-4">
                        <span className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 900 }}>${product.price}</span>
                        <p className="text-muted mt-1 mb-0" style={{ fontSize: '0.8rem' }}>Inclusive of all taxes. Free shipping on orders $50+.</p>
                    </div>

                    <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                        {product.description}
                    </p>

                    {/* Stock */}
                    <div className="mb-3">
                        <span className={`stock-indicator ${inStock ? 'in-stock' : 'out-of-stock'}`}>
                            <i className={`fas ${inStock ? 'fa-check-circle' : 'fa-times-circle'} mr-1`}></i>
                            {inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                        </span>
                    </div>

                    {/* Quantity + Add to Cart */}
                    {inStock && (
                        <div className="d-flex align-items-center gap-3 mb-4" data-aos="fade-up">
                            <div className="quantity-control">
                                <motion.button 
                                    className="qty-btn" 
                                    onClick={() => qty > 1 && setQty(qty - 1)}
                                    whileTap={{ scale: 0.85 }}
                                >−</motion.button>
                                <motion.span key={qty} initial={{ scale: 1.3 }} animate={{ scale: 1 }} style={{ fontWeight: 800, minWidth: '2rem', textAlign: 'center' }}>
                                    {qty}
                                </motion.span>
                                <motion.button 
                                    className="qty-btn" 
                                    onClick={() => qty < Number(product.stock) && setQty(qty + 1)}
                                    whileTap={{ scale: 0.85 }}
                                >+</motion.button>
                            </div>

                            <motion.button 
                                onClick={addToCart} 
                                className={`btn-modern ${addedToCart ? '' : 'btn-primary-modern btn-shimmer'} flex-grow-1`}
                                style={{ 
                                    padding: '1rem', fontSize: '1.05rem',
                                    background: addedToCart ? '#d1fae5' : undefined,
                                    color: addedToCart ? '#065f46' : undefined,
                                }}
                                whileHover={!addedToCart ? { scale: 1.02 } : {}}
                                whileTap={!addedToCart ? { scale: 0.98 } : {}}
                                disabled={addedToCart}
                            >
                                {addedToCart ? (
                                    <><i className="fas fa-check mr-2"></i> Added to Cart</>
                                ) : (
                                    <><i className="fas fa-shopping-bag mr-2"></i> Add to Cart — ${(product.price * qty).toFixed(2)}</>
                                )}
                            </motion.button>
                        </div>
                    )}

                    {/* Trust Badges */}
                    <div className="trust-badges" data-aos="fade-up" data-aos-delay="100">
                        <div className="trust-badge"><i className="fas fa-truck"></i><span>Free Shipping</span></div>
                        <div className="trust-badge"><i className="fas fa-shield-alt"></i><span>Authentic</span></div>
                        <div className="trust-badge"><i className="fas fa-undo"></i><span>30-Day Returns</span></div>
                        <div className="trust-badge"><i className="fas fa-lock"></i><span>Secure</span></div>
                    </div>
                </div>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <section className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <div className="d-flex align-items-center justify-content-between mb-3" data-aos="fade-up">
                        <h3 className="section-title-modern mb-0">You May Also Like</h3>
                        <Link to={`/?category=${encodeURIComponent(product.category)}`} style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
                            View All <i className="fas fa-arrow-right ml-1"></i>
                        </Link>
                    </div>
                    <div className="row g-4">
                        {similarProducts.map((p, idx) => (
                            <div key={p._id} className="col-6 col-md-4 col-lg-3" data-aos="fade-up" data-aos-delay={idx * 80}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}