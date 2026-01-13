import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="wrapper">
      <form onSubmit={submitHandler} className="shadow rounded bg-white p-4">
        <h2 className="mb-4 text-center" style={{ color: '#73152e' }}>Create Account</h2>
        
        <div className="form-group mb-3">
          <label className="form-label">Full Name *</label>
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
          <label className="form-label">Email Address *</label>
          <input 
            name="email" 
            type="email" 
            className="form-control" 
            placeholder="Enter your email" 
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
          <label className="form-label">Date of Birth</label>
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
          <label className="form-label">Phone Number</label>
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
          className="btn btn-primary w-100 py-2"
          disabled={loading}
          style={{ backgroundColor: '#73152e', borderColor: '#73152e' }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Creating Account...
            </>
          ) : (
            "Register Now"
          )}
        </button>
        
        <div className="text-center mt-3">
          <span className="text-muted">
            Already have an account?{" "}
            <a href="/login" style={{ color: '#73152e', textDecoration: 'none' }}>
              <strong>Login here</strong>
            </a>
          </span>
        </div>
        
        <div className="mt-3 text-center">
          <small className="text-muted">
            By registering, you agree to our Terms & Privacy Policy
          </small>
        </div>
      </form>
      
      {/* Debug info - remove in production */}
      <div className="mt-3 text-center small text-muted">
        {/* <p>API Base URL: {process.env.REACT_APP_API_URL || 'Not set'}</p> */}
        <button 
          className="btn btn-sm btn-outline-secondary"
          onClick={() => {
            console.log('Current form:', form);
            console.log('Access Token:', localStorage.getItem('accessToken'));
            console.log('Refresh Token:', localStorage.getItem('refreshToken'));
          }}
        >
          {/* Debug Info */}
        </button>
      </div>
    </div>
  );
}