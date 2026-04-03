import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribing, setSubscribing] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        
        if (!email || !email.trim()) {
            toast.error('Please enter your email address');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setSubscribing(true);
        try {
            const res = await fetch(
                (process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1") + '/newsletter/subscribe',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email.trim() })
                }
            );
            const data = await res.json();
            
            if (data.success) {
                toast.success('🎉 Welcome to the BuyMe family! Check your email.');
                setEmail('');
            } else {
                toast.info(data.message || 'Subscription failed. Please try again.');
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            toast.error('Something went wrong. Please try again later.');
        } finally {
            setSubscribing(false);
        }
    };

    return (
        <footer className="premium-footer">
            <div className="footer-container">
                <div className="row g-5">
                    {/* Brand */}
                    <div className="col-lg-4 col-md-6" data-aos="fade-up">
                        <motion.h2 className="footer-logo" whileHover={{ scale: 1.03 }}>
                            Buy<span>Me</span>
                        </motion.h2>
                        <p className="footer-desc">
                            Curating the world's finest products for discerning customers. Premium quality, exceptional service, delivered to your door.
                        </p>
                        <div className="footer-socials">
                            {['facebook-f', 'twitter', 'instagram', 'linkedin-in'].map((s, i) => (
                                <motion.a key={i} href="#" className="footer-social-link" whileHover={{ y: -3, scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                                    <i className={`fab fa-${s}`}></i>
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="col-lg-2 col-md-6 col-6" data-aos="fade-up" data-aos-delay="100">
                        <h5 className="footer-heading">Shop</h5>
                        <ul className="footer-links">
                            <li><Link to="/search?category=Electronics">Electronics</Link></li>
                            <li><Link to="/search?category=Fashion">Fashion</Link></li>
                            <li><Link to="/search?category=Home & Living">Home & Living</Link></li>
                            <li><Link to="/search?category=Accessories">Accessories</Link></li>
                            <li><Link to="/search?category=Gaming">Gaming</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="col-lg-2 col-md-6 col-6" data-aos="fade-up" data-aos-delay="200">
                        <h5 className="footer-heading">Company</h5>
                        <ul className="footer-links">
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/about">Careers</Link></li>
                            <li><Link to="/about">Press</Link></li>
                            <li><Link to="/about">Sustainability</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
                        <h5 className="footer-heading">Stay Updated</h5>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                            Get exclusive deals, new arrivals, and curated recommendations straight to your inbox.
                        </p>
                        <form onSubmit={handleSubscribe} className="footer-newsletter">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="footer-newsletter-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={subscribing}
                            />
                            <motion.button 
                                type="submit"
                                className="footer-newsletter-btn" 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }}
                                disabled={subscribing}
                                style={{ opacity: subscribing ? 0.6 : 1 }}
                            >
                                {subscribing ? (
                                    <i className="fas fa-spinner fa-spin"></i>
                                ) : (
                                    <i className="fas fa-arrow-right"></i>
                                )}
                            </motion.button>
                        </form>
                        <div className="d-flex gap-3 mt-3 flex-wrap">
                            {[
                                { icon: 'fas fa-shield-alt', label: 'Secure Payments' },
                                { icon: 'fas fa-truck', label: 'Free Shipping $50+' },
                                { icon: 'fas fa-undo', label: 'Easy Returns' }
                            ].map((badge, i) => (
                                <span key={i} style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                                    <i className={badge.icon + " mr-1"} style={{ color: 'var(--secondary)' }}></i> {badge.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} BuyMe Inc. All rights reserved.</p>
                    <div className="footer-bottom-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Cookie Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}