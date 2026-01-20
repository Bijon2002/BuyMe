import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axiosConfig";  // Updated import

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.name || !form.email || !form.password) {
      alert("Please fill in all required fields (Name, Email, Password)");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Password length validation
    if (form.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setLoading(true); // Start loading

    try {
      // Use API instead of axios directly
      const { data } = await API.post('/auth/register', form);

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
          dob: data.data.dob,
          phone: data.data.phone,
          isActive: data.data.isActive
        }));
        
        alert("✅ Registration successful! Welcome " + data.data.name);
        navigate("/user/dashboard");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      
      // Show specific error messages
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else if (err.message.includes("Network Error")) {
        alert("Cannot connect to server. Please check if backend is running.");
      } else {
        alert("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <p className="auth-kicker">Join the community</p>
          <h2>Create your account</h2>
          <p className="auth-subtext">Checkout faster, track orders, and get personalized deals.</p>
        </div>

        <form onSubmit={submitHandler}>
          <div className="form-group mb-3">
            <label className="form-label">Full name *</label>
            <input 
              name="name" 
              className="form-control" 
              placeholder="Enter your name" 
              value={form.name}
              onChange={changeHandler} 
              required 
              disabled={loading}
            />
          </div>
          
          <div className="form-group mb-3">
            <label className="form-label">Email address *</label>
            <input 
              name="email" 
              type="email" 
              className="form-control" 
              placeholder="you@example.com" 
              value={form.email}
              onChange={changeHandler} 
              required 
              disabled={loading}
            />
          </div>
          
          <div className="form-group mb-3">
            <label className="form-label">Password *</label>
            <input 
              name="password" 
              type="password" 
              className="form-control" 
              placeholder="Create a password (min. 6 characters)" 
              value={form.password}
              onChange={changeHandler} 
              required 
              disabled={loading}
            />
            <small className="text-muted">Minimum 6 characters</small>
          </div>
          
          <div className="form-group mb-3">
            <label className="form-label">Date of birth</label>
            <input 
              name="dob" 
              type="date" 
              className="form-control" 
              value={form.dob}
              onChange={changeHandler} 
              disabled={loading}
            />
          </div>
          
          <div className="form-group mb-3">
            <label className="form-label">Phone number</label>
            <input 
              name="phone" 
              type="tel" 
              className="form-control" 
              placeholder="Enter your phone number" 
              value={form.phone}
              onChange={changeHandler} 
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn auth-submit w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating account...
              </>
            ) : (
              "Register now"
            )}
          </button>
          
          <div className="auth-footer">
            <span className="text-muted">Already have an account?</span>
            <Link to="/login" className="auth-link fw-semibold">
              Login here
            </Link>
          </div>

          <div className="auth-perks">
            <div className="perk-chip">Exclusive member pricing</div>
            <div className="perk-chip">Easy returns & support</div>
            <div className="perk-chip">Checkout in one tap</div>
          </div>
        </form>
      </div>
    </div>
  );
}