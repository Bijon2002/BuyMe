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

    // Validation
    if (!form.email || !form.password) {
      toast.error("Please enter both email and password");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const { data } = await API.post('/auth/login', form);

      if (data.success) {
        // Save tokens and user info
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

        // Remember Me
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", form.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // ========== REDIRECT LOGIC ==========
        const redirectPath = localStorage.getItem("redirectAfterLogin") 
          || (data.data.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
        localStorage.removeItem("redirectAfterLogin");

        toast.success(`✅ Welcome ${data.data.name}! Redirecting...`);
        navigate(redirectPath);

      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.message.includes("Network Error")) {
        toast.error("Cannot connect to server. Please check if backend is running.");
      } else if (err.response?.status === 401) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setForm(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="wrapper">
      <form onSubmit={submitHandler} className="shadow rounded bg-white p-4">
        <h2 className="mb-4 text-center" style={{ color: '#73152e' }}>Login to Your Account</h2>
        
        <div className="form-group mb-3">
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group mb-3">
          <label className="form-label">Password *</label>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Remember me
            </label>
          </div>
          
          <Link 
            to="/forgot-password" 
            style={{ color: '#73152e', textDecoration: 'none', fontSize: '0.9rem' }}
          >
            Forgot Password?
          </Link>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary w-100 py-2"
          disabled={loading}
          style={{ backgroundColor: '#73152e', borderColor: '#73152e' }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
        
        <div className="text-center mt-4">
          <span className="text-muted">Don't have an account?{" "}</span>
          <Link 
            to="/register" 
            style={{ color: '#73152e', textDecoration: 'none' }}
          >
            <strong>Create Account</strong>
          </Link>
        </div>
        
        {/* <div className="text-center mt-3">
          <small className="text-muted">
            Demo Credentials:<br />
            Email: test@example.com | Password: 123456<br />
            <strong>Admin:</strong> admin@example.com | Password: Admin@123
          </small>
        </div> */}
      </form>
    </div>
  );
}
