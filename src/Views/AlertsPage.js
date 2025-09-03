import { useState, useEffect } from "react";
import "../styles/AlertsPage.css";

const API_BASE_URL = "http://localhost:8080/api";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mock data for now
  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/alerts`);
      if (!res.ok) throw new Error("Failed to fetch alerts");

      const alertsData = await res.json();
      setAlerts(alertsData);
    } catch (err) {
      setError("Error loading alerts: " + err.message);
      console.error("Error fetching alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case "high": return "#dc2626"; // red
      case "medium": return "#f59e0b"; // orange
      case "low": return "#16a34a"; // green
      default: return "#374151"; // gray
    }
  };

  if (loading) return <div className="alerts-page">Loading alerts...</div>;
  if (error) return <div className="alerts-page error">{error}</div>;

  return (
    <div className="alerts-page">
      <h1>Weather Alerts ⚠️</h1>
      <div className="alerts-container">
        {alerts.length === 0 ? (
          <p>No alerts at the moment. Stay safe!</p>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="alert-card" style={{ borderLeft: `5px solid ${getSeverityColor(alert.severity)}` }}>
              <h3>{alert.type} - {alert.city}</h3>
              <p>{alert.message}</p>
              <span className="severity" style={{ backgroundColor: getSeverityColor(alert.severity) }}>
                {alert.severity}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}