import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosConfig";
import { toast } from "react-toastify";

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
        <div className="auth-wrapper-modern animate-fade-in">
            <div className="auth-form-card card-premium">
                <h1 className="auth-title">Welcome Back</h1>
                <p className="text-center text-muted mb-5">Enter your credentials to access your BuyMe account.</p>

                <form onSubmit={submitHandler}>
                    <div className="form-group-modern">
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
                    </div>

                    <div className="form-group-modern">
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
                    </div>

                    <div className="d-flex align-items-center mb-4">
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
                    </div>

                    <button
                        type="submit"
                        className="btn-modern btn-primary-modern w-100 mb-4"
                        style={{ padding: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm mr-2"></span> Authenticating...</>
                        ) : "Sign In to BuyMe"}
                    </button>

                    <p className="text-center text-muted mb-0">
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Start for free</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
