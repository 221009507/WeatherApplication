import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/credentials/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const data = response.data;

      if (!data.success) {
        setError(data.message || "Login failed!");
        return;
      }

      const { credentials, profile } = data;

      console.log("Login successful:", credentials, profile);

      // Role-based redirect
      if (credentials.role === "ADMIN") {
        navigate("/admin-dashboard", { state: { credentials, profile } });
      } else {
        navigate("/dashboard", { state: { credentials, profile } });
      }

    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed! Please try again.");
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
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
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
