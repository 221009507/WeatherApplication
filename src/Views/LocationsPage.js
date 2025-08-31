import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LocationsPage.css";

export default function LocationsPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState({ city: "", country: "" });
  const [locations, setLocations] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedLocations = localStorage.getItem("locations");
    const savedHistory = localStorage.getItem("locationHistory");
    if (savedLocations) setLocations(JSON.parse(savedLocations));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem("locations", JSON.stringify(locations));
    localStorage.setItem("locationHistory", JSON.stringify(history));
  }, [locations, history]);

  const handleChange = (e) => setLocation({ ...location, [e.target.name]: e.target.value });

  const addLocation = () => {
    if (!location.city || !location.country) return;
    const newLocation = {
      id: Date.now().toString(),
      city: location.city,
      country: location.country,
      timestamp: new Date().toLocaleString(),
    };
    setLocations(prev => [...prev, newLocation]);
    setHistory(prev => [location.city, ...prev.filter(h => h !== location.city)]);
    setLocation({ city: "", country: "" });
  };

  const removeLocation = (id) => setLocations(prev => prev.filter(loc => loc.id !== id));

  const openDashboard = (city) => {
    navigate("/dashboard", { state: { city } });
  };

  return (
    <div className="locations-dashboard">
      <h1>My Locations</h1>

      <div className="location-input">
        <input
          type="text"
          name="city"
          placeholder="City"
          value={location.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={location.country}
          onChange={handleChange}
        />
        <button onClick={addLocation}>Add Location</button>
      </div>

      <h2>Current Locations</h2>
      <div className="locations-grid">
        {locations.map(loc => (
          <div key={loc.id} className="location-card">
            <div
              className="location-info"
              onClick={() => openDashboard(loc.city)}
              style={{ cursor: "pointer" }}
            >
              <p className="location-name">{loc.city}, {loc.country}</p>
              <p>Added: {loc.timestamp}</p>
            </div>
            <button onClick={() => removeLocation(loc.id)}>Remove</button>
          </div>
        ))}
      </div>

      {history.length > 0 && (
        <>
          <h2>Location History</h2>
          <ul className="history-list">
            {history.map((h, idx) => (
              <li
                key={idx}
                onClick={() => openDashboard(h)}
                style={{ cursor: "pointer", color: "#0A61C9" }}
              >
                {h}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}