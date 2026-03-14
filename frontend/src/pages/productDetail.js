import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
};

export default function ProductDetail({ cartItems, setCartItems }) {
    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        setLoading(true);
        fetch(process.env.REACT_APP_API_URL + '/products/' + id)
            .then(res => res.json())
            .then(res => {
                setProduct(res.product);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching product:", err);
                setLoading(false);
            });
    }, [id])

    function addtoCart() {
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const accessToken = localStorage.getItem("accessToken");
        const isAuthenticated = !!(userInfo && accessToken);

        if (!isAuthenticated) {
            toast.warning("Please login to add items to cart");
            localStorage.setItem("redirectAfterLogin", window.location.pathname);
            setTimeout(() => {
                window.location.href = "/login";
            }, 1500);
            return;
        }

        const existingItem = cartItems.find(item => item.product._id === product._id)

        if (!existingItem) {
            const newItem = { product, qty };
            setCartItems((state) => [...state, newItem]);
            toast.success("Item added to cart");
        } else {
            toast.info("Item is already in your cart");
        }
    }

    const increaseQty = () => {
        if (product && qty < product.stock) {
            setQty(qty + 1);
        }
    };

    const decreaseQty = () => {
        if (qty > 1) {
            setQty(qty - 1);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <img src="/images/loader.gif" alt="Loading..." style={{ width: '100px' }} />
        </div>
    );
    if (!product) return <div className="text-center py-5"><h3>Product not found</h3></div>;

    const ratingWidth = (product.ratings / 5) * 100;

    return (
        <div className="product-detail-container">
            {/* Left Pane - Sticky Gallery */}
            <motion.div 
                className="product-gallery"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                <img src={(() => {
                    const img = product.images[0];
                    const pathValue = img ? (img.url || img.image || (typeof img === 'string' ? img : "")) : "";
                    const cleanPath = typeof pathValue === 'string' ? pathValue : "";
                    if (cleanPath.startsWith('/uploads')) {
                        const baseUrl = (process.env.REACT_APP_API_URL || "http://localhost:8000").split('/api')[0];
                        return baseUrl + cleanPath;
                    }
                    return cleanPath || "/images/products/1.jpg";
                })()} alt={product.name} />
            </motion.div>

            {/* Right Pane - Scrolling Details */}
            <motion.div 
                className="product-info-modern"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
            >
                <motion.div variants={fadeUp} className="product-category-modern mb-2">{product.category}</motion.div>
                <motion.h1 variants={fadeUp} className="mb-2" style={{ fontSize: '2.5rem', fontWeight: 800 }}>{product.name}</motion.h1>
                <motion.p variants={fadeUp} className="text-muted" style={{ fontSize: '0.875rem' }}>SKU: {product._id}</motion.p>

                <motion.div variants={fadeUp} className="stars-modern my-4">
                    <div className="rating-outer">
                        <div className="rating-inner" style={{ width: `${ratingWidth}%` }}></div>
                    </div>
                    <span className="ml-2 text-muted">({product.numOfReviews} Verified Reviews)</span>
                </motion.div>

                <motion.div variants={fadeUp} className="h2 mb-4" style={{ fontWeight: 800, color: 'var(--secondary)' }}>
                    ${product.price}
                </motion.div>

                <motion.div variants={fadeUp} className="d-flex align-items-center gap-4 mb-5 flex-wrap">
                    <div className="quantity-control">
                        <button className="qty-btn" onClick={decreaseQty} aria-label="Decrease quantity">−</button>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, minWidth: '1.5rem', textAlign: 'center' }}>{qty}</span>
                        <button className="qty-btn" onClick={increaseQty} aria-label="Increase quantity">+</button>
                    </div>

                    <motion.button 
                        onClick={addtoCart} 
                        disabled={product.stock === 0} 
                        className="btn-modern btn-primary-modern"
                        style={{ padding: '1rem 3rem', fontSize: '1.125rem' }}
                        whileHover={product.stock > 0 ? { scale: 1.05, boxShadow: "0px 5px 15px rgba(115, 21, 46, 0.4)" } : {}}
                        whileTap={product.stock > 0 ? { scale: 0.95 } : {}}
                    >
                        <i className="fa fa-shopping-bag mr-2"></i>
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
                    </motion.button>
                </motion.div>

                <motion.p variants={fadeUp} className="mb-4 d-flex align-items-center">
                    Status: 
                    <span className={`stock-indicator ml-2 ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {product.stock > 0 ? 'In Stock' : 'Currently Unavailable'}
                    </span>
                </motion.p>

                <motion.div variants={fadeUp} className="description-section mt-5 card-premium p-4" style={{ border: 'none', background: 'var(--surface)' }}>
                    <h4 className="mb-3">Overview</h4>
                    <p style={{ lineHeight: 1.7, color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        {product.description}
                    </p>
                </motion.div>

                <motion.div variants={fadeUp} className="mt-5 pt-4" style={{ borderTop: '1px solid #e2e8f0' }}>
                    <p className="text-muted">Sold by: <strong style={{ color: 'var(--secondary)' }}>{product.seller}</strong></p>
                </motion.div>
            </motion.div>
        </div>
    );
}