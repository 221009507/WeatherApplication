import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/api";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      email: formData.email.trim(),
      password: formData.password.trim(),
    };
    try {
      const response = await loginUser(payload);
      const profile = response.data;
      console.log("Login successful:", profile);
      // Save only needed fields in localStorage for account fetch
      localStorage.setItem("userProfile", JSON.stringify({
        userId: profile.userId,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        gender: profile.gender,
        phoneNumber: profile.phoneNumber,
        role: profile.role
      }));
      if (!profile.userId) {
        console.warn("Warning: userId missing from login response.", profile);
      }
      if (profile.role === "ADMIN") {
        navigate("/admin-dashboard", { state: { firstName: profile.firstName } });
      } else {
        navigate("/dashboard", { state: { firstName: profile.firstName } });
      }
    } catch (err) {
      console.error("Login failed:", err.response || err);
      let message = "Login failed! Please try again.";
      if (err.response) {
        if (typeof err.response.data === "string") {
          message = err.response.data;
        } else if (err.response.data.message) {
          message = err.response.data.message;
        }
      }
      setError(message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="username"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          <button type="submit" className="primary-btn">Login</button>
        </form>
        <p className="register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
