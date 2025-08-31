import { useState, useEffect } from "react";
import "../styles/AlertsPage.css";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);

  // Mock data for now
  useEffect(() => {
    setAlerts([
      { id: 1, type: "Storm", message: "Heavy rain expected tomorrow.", severity: "High" },
      { id: 2, type: "Heatwave", message: "Temperatures above 38°C this week.", severity: "Medium" },
      { id: 3, type: "Wind", message: "Strong winds up to 60 km/h.", severity: "Low" },
    ]);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case "high": return "#dc2626"; // red
      case "medium": return "#f59e0b"; // orange
      case "low": return "#16a34a"; // green
      default: return "#374151"; // gray
    }
  };

  return (
    <div className="alerts-page">
      <h1>Weather Alerts ⚠️</h1>
      <div className="alerts-container">
        {alerts.length === 0 ? (
          <p>No alerts at the moment. Stay safe!</p>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="alert-card" style={{ borderLeft: `5px solid ${getSeverityColor(alert.severity)}` }}>
              <h3>{alert.type}</h3>
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