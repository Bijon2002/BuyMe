import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";
import { toast } from "react-toastify";

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
        <div className="auth-wrapper-modern animate-fade-in" style={{ padding: '4rem 0' }}>
            <div className="auth-form-card card-premium">
                <h1 className="auth-title">Join BuyMe</h1>
                <p className="text-center text-muted mb-5">Create your account to start a premium shopping experience.</p>

                <form onSubmit={submitHandler}>
                    <div className="form-group-modern">
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
                    </div>
                    
                    <div className="form-group-modern">
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
                    </div>
                    
                    <div className="form-group-modern">
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
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group-modern">
                                <label className="form-label-modern">Date of Birth</label>
                                <input 
                                    name="dob" 
                                    type="date" 
                                    className="form-input-modern" 
                                    value={form.dob}
                                    onChange={changeHandler} 
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group-modern">
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
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn-modern btn-primary-modern w-100 mb-4 mt-2"
                        style={{ padding: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm mr-2"></span> Joining...</>
                        ) : "Create Account"}
                    </button>
                    
                    <p className="text-center text-muted mb-0">
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}