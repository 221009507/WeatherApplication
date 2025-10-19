import React, { useState } from "react";
import "../styles/AlertsPage.css";

function AlertPage() {
  const [city, setCity] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [weatherData, setWeatherData] = useState(null); // Add state for weather data

  const fetchAlerts = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    setAlerts([]);
    setWeatherData(null); // Reset weather data

    try {
      const response = await fetch(`http://localhost:8080/api/alerts/${encodeURIComponent(city.trim())}`);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.alerts && data.alerts.length > 0) {
        setAlerts(data.alerts);
        setMessage(`Found ${data.alerts.length} alert(s) for ${city}`);
      } else if (data.message) {
        setMessage(data.message);
        setAlerts([]);
      } else {
        setMessage("No weather alerts found");
      }

      // If your API also returns current weather data
      if (data.currentWeather) {
        setWeatherData(data.currentWeather);
      }
    } catch (err) {
      setError(`Failed to fetch alerts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to format temperature to one decimal place
  const formatTemperature = (temp) => {
    if (temp === undefined || temp === null) return "N/A";
    return `${parseFloat(temp).toFixed(1)}°C`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchAlerts();
    }
  };

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <h1>Weather Alerts</h1>
        <p>Check for active weather warnings and alerts worldwide</p>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            onClick={fetchAlerts} 
            disabled={loading || !city.trim()}
          >
            {loading ? "Searching..." : "🔍"}
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {loading && (
        <div className="status-message loading">
          Checking weather in <strong>{city}</strong>...
        </div>
      )}
      
      {message && (
        <div className="status-message info">
          {message}
        </div>
      )}

      {error && (
        <div className="status-message error">
          {error}
        </div>
      )}

      {/* Normal Weather Conditions - ADD THIS SECTION */}
      {weatherData && !loading && (
        <div className="weather-conditions">
          <div className="weather-card normal">
            <h3>Normal Weather Conditions</h3>
            <div className="weather-location">📍 {weatherData.location || city}</div>
            <div className="weather-details">
              Current conditions: {weatherData.conditions || "clear sky"}. 
              Temperature: {formatTemperature(weatherData.temperature)}. 
              No severe weather alerts.
            </div>
            <div className="weather-source">Source: Weather Monitor</div>
          </div>
        </div>
      )}

      {/* Alerts List */}
      {alerts.length > 0 && (
        <div className="alerts-section">
          <div className="alerts-list">
            {alerts.map((alert, index) => (
              <div className={`alert-card ${alert.severity?.toLowerCase()}`} key={index}>
                <div className="alert-main">
                  <div className="alert-title">
                    <span className="alert-icon">
                      {alert.severity === 'High' ? '🚨' : '⚠️'}
                    </span>
                    {alert.event}
                  </div>
                  <div className="alert-severity">
                    {alert.severity}
                  </div>
                </div>
                <div className="alert-details">
                  <div className="alert-location">📍 {alert.city}</div>
                  <div className="alert-description">{alert.description}</div>
                  <div className="alert-source">Source: {alert.senderName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Alerts - Show normal weather when no alerts but we have weather data */}
      {alerts.length === 0 && !loading && message && !error && !weatherData && (
        <div className="no-alerts">
          <div className="all-clear">
            <div className="clear-icon">✅</div>
            <h3>All Clear</h3>
            <p>No severe weather alerts for this location</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlertPage;