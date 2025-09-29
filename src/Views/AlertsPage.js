import React, { useState } from "react";
import "../styles/AlertsPage.css";

const API_KEY = "58c9a629eb51a74a234950251591207e"; 
function AlertPage() {
  const [city, setCity] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAlerts = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    setAlerts([]);

    try {
  
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoRes.json();

      if (!geoData || geoData.length === 0) {
        setError("City not found");
        setLoading(false);
        return;
      }

      const { lat, lon } = geoData[0];

      
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&appid=${API_KEY}`
      );
      const weatherData = await weatherRes.json();

      if (!weatherData.alerts || weatherData.alerts.length === 0) {
        setError("No alerts found for this city.");
      } else {
        setAlerts(weatherData.alerts);
      }
    } catch (err) {
      setError("Failed to fetch alerts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="alerts-container">
      <h1>Weather Alerts</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchAlerts}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="alerts-list">
        {alerts.map((alert, index) => (
          <div className="alert-card" key={index}>
            <h2>{alert.event}</h2>
            <p><strong>Sender:</strong> {alert.sender_name}</p>
            <p><strong>Description:</strong> {alert.description}</p>
            <p><strong>Start:</strong> {new Date(alert.start * 1000).toLocaleString()}</p>
            <p><strong>End:</strong> {new Date(alert.end * 1000).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlertPage;