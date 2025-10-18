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

    try {
      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password.trim(),
      });

      const { token, user } = response.data; // expecting backend returns { token, user }

      // Save JWT token in localStorage
      localStorage.setItem("jwtToken", token);

      // Save user info for display and identification
      localStorage.setItem("userProfile", JSON.stringify(user));

      // Navigate to dashboard based on role
      if (user.role === "ADMIN") {
        navigate("/admin-dashboard", { state: { firstName: user.firstName } });
      } else {
        navigate("/dashboard", { state: { firstName: user.firstName } });
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
