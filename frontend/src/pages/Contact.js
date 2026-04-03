import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
    const [submitting, setSubmitting] = useState(false);
    const [submittingContact, setSubmittingContact] = useState(false);
    const [subscribeEmail, setSubscribeEmail] = useState("");
    const [status, setStatus] = useState({ type: '', message: '' });
    const [contactStatus, setContactStatus] = useState({ type: '', message: '' });
    
    const [contactData, setContactData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setSubmittingContact(true);
        try {
            const res = await fetch((process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1") + '/contact/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contactData)
            });
            const data = await res.json();
            if (data.success) {
                setContactStatus({ type: 'success', message: data.message });
                setContactData({ name: '', email: '', subject: '', message: '' });
            } else {
                setContactStatus({ type: 'error', message: data.message || 'Submission failed.' });
            }
        } catch (error) {
            setContactStatus({ type: 'error', message: 'Connection error while sending message.' });
        }
        setSubmittingContact(false);
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!subscribeEmail) return;
        setSubmitting(true);
        try {
            const res = await fetch((process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1") + '/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: subscribeEmail })
            });
            const data = await res.json();
            if (data.success) {
                setStatus({ type: 'success', message: 'You are now subscribed to premium alerts!' });
                setSubscribeEmail("");
            } else {
                setStatus({ type: 'error', message: data.message || 'Subscription failed.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Connection error.' });
        }
        setSubmitting(false);
    };

    const contactMethods = [
        { icon: 'fas fa-phone-alt', label: 'Call Us', value: '+1 (800) BUY-ME-NOW', color: '#10b981' },
        { icon: 'fas fa-envelope', label: 'Email', value: 'hello@buyme.premium', color: '#3b82f6' },
        { icon: 'fas fa-map-marker-alt', label: 'Global HQ', value: '77 Silicon Valley Blvd, CA', color: '#f59e0b' },
        { icon: 'fas fa-clock', label: 'Working Hours', value: '24/7 Premium Support', color: '#8b5cf6' }
    ];

    return (
        <div className="contact-page-wrapper pb-5">
            {/* Hero Section */}
            <motion.section 
              className="mb-5 position-relative text-center overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{
                  height: '60vh',
                  minHeight: '400px',
                  background: 'url("https://images.unsplash.com/photo-1516328314061-1b4b9468e2b5?q=80&w=2070&auto=format&fit=crop")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.4)',
                  position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.5) 100%)', zIndex: 1 }}></div>
              <div style={{ position: 'relative', zIndex: 2, padding: '3rem', maxWidth: '800px' }}>
                  <motion.span 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'var(--secondary)', marginBottom: '1.5rem', display: 'inline-block' }}
                  >
                    Get In Touch
                  </motion.span>
                  <motion.h1 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-2px', color: 'white' }}
                  >
                    We're Here to <span style={{ color: 'var(--secondary)' }}>Listen</span>
                  </motion.h1>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mx-auto" 
                    style={{ maxWidth: '600px', fontSize: '1.3rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}
                  >
                    Whether you have a question about our premium collection or need white-glove support, our team is ready to serve you.
                  </motion.p>
              </div>
            </motion.section>

            <div className="container">
                <div className="row g-5">
                    {/* Contact Info Cards */}
                    <div className="col-lg-4">
                        <div className="d-flex flex-column gap-4">
                            {contactMethods.map((method, i) => (
                                <motion.div 
                                    key={i}
                                    className="card-premium p-4 d-flex align-items-center gap-4"
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ x: 10 }}
                                >
                                    <div style={{ width: '55px', height: '55px', borderRadius: '15px', background: `${method.color}15`, color: method.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                        <i className={method.icon}></i>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{method.label}</div>
                                        <div style={{ fontWeight: 800, fontSize: '1rem' }}>{method.value}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="col-lg-8" data-aos="fade-up">
                        <div className="card-premium p-5 h-100 shadow-lg" style={{ borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ fontWeight: 900, marginBottom: '2rem' }}>Send us a Message</h3>
                            <form className="row g-4" onSubmit={handleContactSubmit}>
                                <div className="col-md-6">
                                    <label className="form-label-premium">Full Name</label>
                                    <input type="text" className="form-input-premium" placeholder="Enter your name" value={contactData.name} onChange={e => setContactData({...contactData, name: e.target.value})} required/>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label-premium">Email Address</label>
                                    <input type="email" className="form-input-premium" placeholder="email@example.com" value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} required/>
                                </div>
                                <div className="col-12">
                                    <label className="form-label-premium">Subject</label>
                                    <input type="text" className="form-input-premium" placeholder="How can we help?" value={contactData.subject} onChange={e => setContactData({...contactData, subject: e.target.value})} required/>
                                </div>
                                <div className="col-12">
                                    <label className="form-label-premium">Message</label>
                                    <textarea className="form-input-premium" rows="5" placeholder="Tell us more..." value={contactData.message} onChange={e => setContactData({...contactData, message: e.target.value})} required></textarea>
                                </div>
                                {contactStatus.message && (
                                    <div className="col-12">
                                        <div className={`alert ${contactStatus.type === 'success' ? 'alert-success' : 'alert-danger'}`} style={{ borderRadius: '15px', fontWeight: 600 }}>
                                            {contactStatus.message}
                                        </div>
                                    </div>
                                )}
                                <div className="col-12 mt-2">
                                    <button type="submit" disabled={submittingContact} className="btn-modern btn-primary-modern w-100 py-3" style={{ fontSize: '1.1rem' }}>
                                        {submittingContact ? "Sending..." : "Send Message"} <i className="fas fa-paper-plane ml-2"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Newsletter Section - Striking Redesign */}
                <section className="mt-5 pt-5 mb-5" data-aos="zoom-in">
                    <div className="newsletter-premium-card p-5 text-center overflow-hidden position-relative" style={{ borderRadius: '40px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.4)', color: 'white' }}>
                        <div className="position-relative z-index-2">
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--secondary)', marginBottom: '1.5rem', display: 'inline-block' }}>Newsletter Subscription</span>
                            <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-1px' }}>Stay Ahead of the <span style={{ color: 'var(--secondary)' }}>Curve</span></h2>
                            <p className="mx-auto" style={{ maxWidth: '550px', fontSize: '1.1rem', opacity: 0.7, marginBottom: '2.5rem' }}>
                                Join 50,000+ premium members and get early access to exclusive collections, VIP pricing, and curated styling tips.
                            </p>
                            
                            <form onSubmit={handleSubscribe} className="d-flex flex-column flex-sm-row gap-3 mx-auto" style={{ maxWidth: '600px' }}>
                                <div className="flex-grow-1 position-relative">
                                    <i className="fas fa-envelope position-absolute" style={{ left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }}></i>
                                    <input 
                                        type="email" 
                                        className="newsletter-input-premium w-100" 
                                        placeholder="your.email@premium.com"
                                        value={subscribeEmail}
                                        onChange={(e) => setSubscribeEmail(e.target.value)}
                                        style={{ padding: '1rem 1rem 1rem 3.5rem', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 600 }}
                                    />
                                </div>
                                <button type="submit" disabled={submitting} className="btn-modern btn-secondary-modern py-3 px-5" style={{ borderRadius: '15px', fontSize: '1rem', fontWeight: 800 }}>
                                    {submitting ? "Joining..." : "Join the Club"}
                                </button>
                            </form>
                            {status.message && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-3 ${status.type === 'success' ? 'text-success' : 'text-danger'}`} style={{ fontWeight: 700 }}>
                                    {status.message}
                                </motion.div>
                            )}
                        </div>
                        {/* Decorative background element */}
                        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(254, 189, 105, 0.05)', filter: 'blur(60px)' }}></div>
                    </div>
                </section>
            </div>
        </div>
    );
}
