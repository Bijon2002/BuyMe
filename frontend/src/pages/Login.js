import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosConfig";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            toast.error("Please enter both email and password");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);

        try {
            const { data } = await API.post('/auth/login', form);

            if (data.success) {
                localStorage.setItem("accessToken", data.data.accessToken);
                localStorage.setItem("refreshToken", data.data.refreshToken);
                localStorage.setItem("userInfo", JSON.stringify({
                    _id: data.data._id,
                    name: data.data.name,
                    email: data.data.email,
                    role: data.data.role,
                    profilePic: data.data.profilePic,
                    isActive: data.data.isActive
                }));

                if (rememberMe) {
                    localStorage.setItem("rememberedEmail", form.email);
                } else {
                    localStorage.removeItem("rememberedEmail");
                }

                const redirectPath = localStorage.getItem("redirectAfterLogin")
                    || (data.data.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
                localStorage.removeItem("redirectAfterLogin");

                toast.success(`Welcome back, ${data.data.name}!`);
                navigate(redirectPath);

            } else {
                toast.error(data.message || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const rememberedEmail = localStorage.getItem("rememberedEmail");
        if (rememberedEmail) {
            setForm(prev => ({ ...prev, email: rememberedEmail }));
            setRememberMe(true);
        }
    }, []);

    return (
        <div className="auth-wrapper-modern">
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
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                    👋
                </motion.div>
                <h1 className="auth-title">Welcome Back</h1>
                <p className="text-center text-muted mb-5">Enter your credentials to access your BuyMe account.</p>

                <form onSubmit={submitHandler}>
                    <motion.div 
                        className="form-group-modern"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <label className="form-label-modern">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input-modern"
                            placeholder="name@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </motion.div>

                    <motion.div 
                        className="form-group-modern"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <label className="form-label-modern mb-0">Password</label>
                            <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            name="password"
                            className="form-input-modern"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </motion.div>

                    <motion.div 
                        className="d-flex align-items-center mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <input
                            type="checkbox"
                            id="rememberMe"
                            className="mr-2"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            disabled={loading}
                            style={{ width: '1.1rem', height: '1.1rem', accentColor: 'var(--primary)' }}
                        />
                        <label htmlFor="rememberMe" className="text-muted mb-0" style={{ fontSize: '0.875rem', cursor: 'pointer' }}>
                            Keep me logged in
                        </label>
                    </motion.div>

                    <motion.button
                        type="submit"
                        className="btn-modern btn-primary-modern btn-shimmer w-100 mb-4"
                        style={{ padding: '1rem', fontSize: '1.05rem' }}
                        disabled={loading}
                        whileHover={!loading ? { scale: 1.02 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm mr-2"></span> Authenticating...</>
                        ) : (
                            <><i className="fas fa-sign-in-alt mr-2"></i> Sign In to BuyMe</>
                        )}
                    </motion.button>

                    {/* Divider */}
                    <div className="d-flex align-items-center mb-4" style={{ gap: '1rem' }}>
                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>or continue with</span>
                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
                    </div>

                    {/* Social Buttons (Visual Only) */}
                    <div className="d-flex gap-3 mb-4">
                        <button type="button" className="btn-modern w-100" style={{ background: '#f1f5f9', color: '#333', border: '1px solid #e2e8f0', fontSize: '0.9rem', padding: '0.7rem' }}>
                            <i className="fab fa-google mr-2" style={{ color: '#ea4335' }}></i> Google
                        </button>
                        <button type="button" className="btn-modern w-100" style={{ background: '#f1f5f9', color: '#333', border: '1px solid #e2e8f0', fontSize: '0.9rem', padding: '0.7rem' }}>
                            <i className="fab fa-github mr-2"></i> GitHub
                        </button>
                    </div>

                    <p className="text-center text-muted mb-0">
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Start for free</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
}
