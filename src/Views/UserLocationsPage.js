import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import locationService from "../services/locationService";
import "../styles/LocationsPage.css";

export default function UserLocationsPage() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const data = await locationService.getAll();
      setLocations(data);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    }
  };

  const openDashboard = (city) => {
    navigate("/dashboard", { state: { city } });
  };

  const filteredLocations = locations.filter((loc) =>
    loc.cityName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="locations-dashboard">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back
      </button>

      <h1>Available Locations</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by city"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Locations Grid */}
      <div className="locations-grid">
        {filteredLocations.map((loc) => (
          <div
            key={loc.locationId}
            className="location-card"
            onClick={() => openDashboard(loc.cityName)}
          >
            {/* Weather Icon */}
            <div className="weather-icon">☀️</div>

            {/* City & Country */}
            <p className="location-name">
              {loc.cityName}, {loc.country}
            </p>

            {/* Coordinates */}
            {loc.latitude && loc.longitude && (
              <p className="coordinates">
                Lat: {loc.latitude}, Lon: {loc.longitude}
              </p>
            )}

            {/* Temperature Placeholder */}
            <div className="temperature">22°C</div>
          </div>
        ))}
      </div>
    </div>
  );
}
