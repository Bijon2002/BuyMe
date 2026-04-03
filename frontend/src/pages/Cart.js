import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart({ cartItems, setCartItems }) {
    const [complete, setComplete] = useState(false);
    const navigate = useNavigate();
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    const isAuthenticated = !!userInfo;

    function increaseQty(item) {
        if (item.product.stock === item.qty) return;
        const updatedItems = cartItems.map((i) => {
            if (i.product._id === item.product._id) {
                return { ...i, qty: i.qty + 1 };
            }
            return i;
        });
        setCartItems(updatedItems);
    }

    function decreaseQty(item) {
        if (item.qty <= 1) return;
        const updatedItems = cartItems.map((i) => {
            if (i.product._id === item.product._id) {
                return { ...i, qty: i.qty - 1 };
            }
            return i;
        });
        setCartItems(updatedItems);
    }

    function removeItem(item) {
        const updatedItems = cartItems.filter((i) => i.product._id !== item.product._id);
        setCartItems(updatedItems);
        toast.info("Item removed from cart");
    }

    function placeOrderHandler() {
        if (!isAuthenticated) {
            toast.warning("Please login to place an order");
            navigate('/login');
            return;
        }

        const amount = cartItems.reduce(
            (acc, item) => acc + Number(item.product.price) * item.qty,
            0
        );

        fetch(process.env.REACT_APP_API_URL + "/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                CartItems: cartItems,
                amount: amount.toString(),
                status: "success",
                createdAt: new Date(),
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Order failed");
                return res.json();
            })
            .then(() => {
                setCartItems([]);
                setComplete(true);
                toast.success("Order placed successfully");
            })
            .catch((err) => {
                console.error(err);
                toast.error("Order failed. Please try again.");
            });
    }

    if (complete) {
        return (
            <motion.div 
                className="text-center py-5"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
            >
                <motion.div 
                    style={{ fontSize: '5rem', marginBottom: '1.5rem', color: 'var(--success)' }}
                    animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8 }}
                >
                    <i className="fas fa-check-circle"></i>
                </motion.div>
                <h1 className="mb-3" style={{ fontWeight: 800 }}>Order Complete!</h1>
                <p className="text-muted mb-2">Your premium items are being prepared for shipment.</p>
                <p className="text-muted mb-5" style={{ fontSize: '0.9rem' }}>You'll receive a confirmation email shortly.</p>
                <Link to="/" className="btn-modern btn-primary-modern btn-shimmer">
                    Continue Shopping <i className="fas fa-arrow-right ml-2"></i>
                </Link>
            </motion.div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <motion.div 
                className="text-center py-5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div 
                    style={{ fontSize: '5rem', marginBottom: '1.5rem', color: 'var(--primary)', opacity: 0.2 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <i className="fas fa-shopping-bag"></i>
                </motion.div>
                <h2 className="mb-3" style={{ fontWeight: 800 }}>Your Bag is Empty</h2>
                <p className="text-muted mb-5">Start exploring and fill it with amazing products.</p>
                <Link to="/" className="btn-modern btn-primary-modern btn-shimmer">
                    Discover Products <i className="fas fa-arrow-right ml-2"></i>
                </Link>
            </motion.div>
        );
    }

    const subtotal = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const totalAmount = cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0);
    const freeShippingThreshold = 50;
    const shippingProgress = Math.min((totalAmount / freeShippingThreshold) * 100, 100);
    const needsMore = freeShippingThreshold - totalAmount;

    return (
        <div data-aos="fade-up">
            <h1 className="mb-4" style={{ fontWeight: 800 }}>
                Your Bag <span className="gradient-text">({cartItems.length})</span>
            </h1>

            {/* Free Shipping Progress */}
            {needsMore > 0 ? (
                <div className="card-premium p-3 mb-4" data-aos="fade-up" style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.03), rgba(254,189,105,0.03))' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}><i className="fas fa-truck mr-2" style={{ color: 'var(--primary)' }}></i> Add <strong style={{ color: 'var(--primary)' }}>${needsMore.toFixed(2)}</strong> more for <strong style={{ color: 'var(--success)' }}>FREE shipping!</strong></span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{Math.floor(shippingProgress)}%</span>
                    </div>
                    <div className="shipping-progress">
                        <motion.div 
                            className="shipping-progress-bar" 
                            initial={{ width: 0 }}
                            animate={{ width: `${shippingProgress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        ></motion.div>
                    </div>
                </div>
            ) : (
                <div className="card-premium p-3 mb-4" data-aos="fade-up" style={{ background: '#d1fae5', border: '1px solid #6ee7b7' }}>
                    <span style={{ fontWeight: 700, color: '#065f46' }}><i className="fas fa-check-circle mr-2"></i> You've unlocked FREE shipping!</span>
                </div>
            )}

            <div className="row">
                <div className="col-12 col-lg-8">
                    <AnimatePresence mode="popLayout">
                        {cartItems.map((item, idx) => (
                            <motion.div 
                                key={item.product._id} 
                                className="cart-item-row"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50, height: 0, marginBottom: 0, padding: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25, delay: idx * 0.05 }}
                                layout
                            >
                                <img src={item.product.images[0].image} alt={item.product.name} className="cart-item-img" />
                                
                                <div>
                                    <Link to={"/product/" + item.product._id} style={{ textDecoration: 'none', color: 'var(--text-main)', fontWeight: 700, fontSize: '1.05rem' }}>
                                        {item.product.name}
                                    </Link>
                                    <p className="text-muted mb-0 small">{item.product.seller}</p>
                                </div>

                                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                                    <span className="gradient-text">${item.product.price}</span>
                                </div>

                                <div className="quantity-control">
                                    <button className="qty-btn" onClick={() => decreaseQty(item)} style={{ width: '2rem', height: '2rem' }}>−</button>
                                    <motion.span 
                                        key={item.qty}
                                        initial={{ scale: 1.4, opacity: 0.5 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        style={{ fontWeight: 700 }}
                                    >
                                        {item.qty}
                                    </motion.span>
                                    <button className="qty-btn" onClick={() => increaseQty(item)} style={{ width: '2rem', height: '2rem' }}>+</button>
                                </div>

                                <motion.button 
                                    onClick={() => removeItem(item)} 
                                    className="btn-modern" 
                                    style={{ padding: '0.5rem', color: 'var(--error)' }}
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    whileTap={{ scale: 0.8 }}
                                >
                                    <i className="fa fa-trash"></i>
                                </motion.button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="col-12 col-lg-4">
                    <motion.div 
                        className="card-premium order-summary-card p-4"
                        data-aos="fade-left"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="mb-4" style={{ fontWeight: 800 }}>Order Summary</h3>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Subtotal ({subtotal} units)</span>
                            <span style={{ fontWeight: 700 }}>${totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Estimated Tax</span>
                            <span style={{ fontWeight: 600 }}>${(totalAmount * 0.08).toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-4">
                            <span className="text-muted">Shipping</span>
                            <span style={{ fontWeight: 700, color: totalAmount >= 50 ? 'var(--success)' : 'var(--text-main)' }}>
                                {totalAmount >= 50 ? 'Free' : '$4.99'}
                            </span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between mb-4 mt-2">
                            <span className="h4 mb-0" style={{ fontWeight: 800 }}>Total</span>
                            <span className="h4 mb-0 gradient-text" style={{ fontWeight: 900 }}>
                                ${(totalAmount + (totalAmount * 0.08) + (totalAmount >= 50 ? 0 : 4.99)).toFixed(2)}
                            </span>
                        </div>
                        <motion.button 
                            onClick={placeOrderHandler} 
                            className="btn-modern btn-primary-modern btn-shimmer w-100"
                            style={{ padding: '1rem', fontSize: '1.05rem' }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <i className="fas fa-lock mr-2"></i> Checkout Now
                        </motion.button>

                        {/* Trust Badges */}
                        <div className="trust-badges">
                            <div className="trust-badge">
                                <i className="fas fa-shield-alt"></i>
                                <span>Secure</span>
                            </div>
                            <div className="trust-badge">
                                <i className="fas fa-undo"></i>
                                <span>Returns</span>
                            </div>
                            <div className="trust-badge">
                                <i className="fas fa-lock"></i>
                                <span>Encrypted</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}