
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminAlertsPage.css";

export default function AdminAlertsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("Low");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      alert("Please fill in all fields!");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:8080/alerts", {
        title,
        message,
        severity,
      });

      alert("Alert published successfully!");
      setTitle("");
      setMessage("");
      setSeverity("Low");
    } catch (error) {
      console.error("Error publishing alert:", error);
      if (error.response) {
        alert(`Server error: ${error.response.status} - ${error.response.data}`);
      } else if (error.request) {
        alert("Network error: Cannot reach backend.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="admin-alerts-page">
      {/* Navbar */}
      <nav className="admin-navbar">
        <h1>Admin Panel</h1>
        <div className="navbar-right">
          <button
            className="dashboard-btn"
            onClick={() => navigate("/admin-dashboard")}
          >
            Dashboard
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <div className="admin-alerts-container">
        <h1>Create Weather Alert</h1>

        {/* Alert Form */}
        <div className="alert-card">
          <form className="alert-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Alert Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Alert Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <button type="submit" disabled={loading}>
              {loading ? "Publishing..." : "Publish Alert"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
