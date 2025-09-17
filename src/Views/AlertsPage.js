import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AlertsPage.css";

export default function AlertsPage() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/alerts");
        setAlerts(res.data || []);
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
        setError("Failed to load alerts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className="alerts-page">
      {/* Navbar */}
      <nav className="alerts-navbar">
  <h1>Weather Alerts</h1>
  <button className="dashboard-btn" onClick={() => navigate("/dashboard")}>
    Dashboard
  </button>
</nav>

      {/* Main Container */}
      <div className="alerts-container">
        {loading && <p className="info-msg">Loading alerts...</p>}
        {error && <p className="error-msg">{error}</p>}

        {!loading && !error && alerts.length === 0 && (
          <p className="info-msg">No alerts at the moment.</p>
        )}

        {!loading && !error && alerts.length > 0 && (
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div
                key={alert.alertId}
                className={`alert-card ${alert.severity.toLowerCase()}`}
              >
                <h2>{alert.title}</h2>
                <p>{alert.message}</p>
                <div className="alert-meta">
                  <span>Severity: {alert.severity}</span>
                  <span>
                    Created:{" "}
                    {alert.createdAt
                      ? new Date(alert.createdAt).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


