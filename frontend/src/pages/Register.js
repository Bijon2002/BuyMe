import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        dob: "",
        phone: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Password strength
    const getPasswordStrength = () => {
        const p = form.password;
        if (!p) return { level: 0, label: '', color: '' };
        let score = 0;
        if (p.length >= 6) score++;
        if (p.length >= 8) score++;
        if (/[A-Z]/.test(p)) score++;
        if (/[0-9]/.test(p)) score++;
        if (/[^A-Za-z0-9]/.test(p)) score++;
        
        if (score <= 1) return { level: 20, label: 'Weak', color: '#ef4444' };
        if (score <= 2) return { level: 40, label: 'Fair', color: '#f59e0b' };
        if (score <= 3) return { level: 60, label: 'Good', color: '#3b82f6' };
        if (score <= 4) return { level: 80, label: 'Strong', color: '#10b981' };
        return { level: 100, label: 'Excellent', color: '#059669' };
    };

    const strength = getPasswordStrength();

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.password) {
            toast.error("Please fill in all required fields (Name, Email, Password)");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        if (form.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);

        try {
            const { data } = await API.post('/auth/register', form);

            if (data.success) {
                localStorage.setItem("accessToken", data.data.accessToken);
                localStorage.setItem("refreshToken", data.data.refreshToken);
                localStorage.setItem("userInfo", JSON.stringify({
                    _id: data.data._id,
                    name: data.data.name,
                    email: data.data.email,
                    role: data.data.role,
                    profilePic: data.data.profilePic,
                    dob: data.data.dob,
                    phone: data.data.phone,
                    isActive: data.data.isActive
                }));
                
                toast.success(`Welcome to BuyMe, ${data.data.name}!`);
                navigate("/user/dashboard");
            } else {
                toast.error(data.message || "Registration failed");
            }
        } catch (err) {
            console.error("Registration error:", err);
            const msg = err.response?.data?.message || "Registration failed. Try a different email.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper-modern" style={{ padding: '4rem 0' }}>
            {/* Background Orbs */}
            <div className="auth-bg-orbs">
                <div className="auth-orb auth-orb-1"></div>
                <div className="auth-orb auth-orb-2"></div>
            </div>

            <motion.div 
                className="auth-form-card"
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
                <motion.div 
                    style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2.5rem' }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                    ✨
                </motion.div>
                <h1 className="auth-title">Join BuyMe</h1>
                <p className="text-center text-muted mb-4">Create your account to start a premium shopping experience.</p>

                {/* Progress Steps */}
                <div className="d-flex justify-content-center gap-2 mb-4">
                    {['Account', 'Details', 'Start!'].map((step, i) => (
                        <div key={i} className="d-flex align-items-center gap-2">
                            <div style={{
                                width: '28px', height: '28px', borderRadius: '50%',
                                background: i === 0 ? 'var(--primary)' : '#e2e8f0',
                                color: i === 0 ? 'white' : 'var(--text-muted)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.75rem', fontWeight: 700
                            }}>
                                {i + 1}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: i === 0 ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600 }}>{step}</span>
                            {i < 2 && <div style={{ width: '20px', height: '2px', background: '#e2e8f0' }}></div>}
                        </div>
                    ))}
                </div>

                <form onSubmit={submitHandler}>
                    <motion.div className="form-group-modern" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                        <label className="form-label-modern">Full Name *</label>
                        <input 
                            name="name" 
                            className="form-input-modern" 
                            placeholder="John Doe" 
                            value={form.name}
                            onChange={changeHandler} 
                            required 
                            disabled={loading}
                        />
                    </motion.div>
                    
                    <motion.div className="form-group-modern" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <label className="form-label-modern">Email Address *</label>
                        <input 
                            name="email" 
                            type="email" 
                            className="form-input-modern" 
                            placeholder="john@example.com" 
                            value={form.email}
                            onChange={changeHandler} 
                            required 
                            disabled={loading}
                        />
                    </motion.div>
                    
                    <motion.div className="form-group-modern" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                        <label className="form-label-modern">Secure Password *</label>
                        <input 
                            name="password" 
                            type="password" 
                            className="form-input-modern" 
                            placeholder="Minimum 6 characters" 
                            value={form.password}
                            onChange={changeHandler} 
                            required 
                            disabled={loading}
                        />
                        {/* Password Strength Meter */}
                        {form.password && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{ marginTop: '0.5rem' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Password Strength</span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: strength.color }}>{strength.label}</span>
                                </div>
                                <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                                    <motion.div 
                                        style={{ height: '100%', background: strength.color, borderRadius: '999px' }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${strength.level}%` }}
                                        transition={{ duration: 0.3 }}
                                    ></motion.div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <motion.div className="form-group-modern" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                                <label className="form-label-modern">Date of Birth</label>
                                <input 
                                    name="dob" 
                                    type="date" 
                                    className="form-input-modern" 
                                    value={form.dob}
                                    onChange={changeHandler} 
                                    disabled={loading}
                                />
                            </motion.div>
                        </div>
                        <div className="col-md-6">
                            <motion.div className="form-group-modern" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                                <label className="form-label-modern">Phone Number</label>
                                <input 
                                    name="phone" 
                                    type="tel" 
                                    className="form-input-modern" 
                                    placeholder="+1 (555) 000-0000" 
                                    value={form.phone}
                                    onChange={changeHandler} 
                                    disabled={loading}
                                />
                            </motion.div>
                        </div>
                    </div>
                    
                    <motion.button 
                        type="submit" 
                        className="btn-modern btn-primary-modern btn-shimmer w-100 mb-4 mt-2"
                        style={{ padding: '1rem', fontSize: '1.05rem' }}
                        disabled={loading}
                        whileHover={!loading ? { scale: 1.02 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm mr-2"></span> Creating Account...</>
                        ) : (
                            <><i className="fas fa-user-plus mr-2"></i> Create Account</>
                        )}
                    </motion.button>
                    
                    <p className="text-center text-muted mb-0">
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}