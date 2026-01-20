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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="auth-kicker">Welcome back</p>
          <h2>Login to your account</h2>
          <p className="auth-subtext">Access your orders, wishlist, and personalized recommendations.</p>
        </div>

        <form onSubmit={submitHandler}>
          <div className="form-group mb-3">
            <label className="form-label">Email address *</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="you@example.com"
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

          <div className="auth-inline mb-4">
            <label className="form-check mb-0">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <span className="form-check-label">Remember me</span>
            </label>

            <Link to="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn auth-submit w-100"
            disabled={loading}
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

          <div className="auth-footer">
            <span className="text-muted">New here?</span>
            <Link to="/register" className="auth-link fw-semibold">
              Create an account
            </Link>
          </div>

          <div className="auth-perks">
            <div className="perk-chip">Track orders in real time</div>
            <div className="perk-chip">Save multiple addresses</div>
            <div className="perk-chip">Members-only offers</div>
          </div>
        </form>
      </div>
    </div>
  );
}
