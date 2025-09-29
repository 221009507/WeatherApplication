import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import locationService from "../services/locationService";
import "../styles/LocationsPage.css";

export default function AdminLocationPage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState({
    cityName: "",
    country: "",
    latitude: "",
    longitude: "",
  });
  const [locations, setLocations] = useState([]);

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

  const handleChange = (e) =>
    setLocation({ ...location, [e.target.name]: e.target.value });

  const addLocation = async () => {
    if (!location.cityName || !location.country) return;

    try {
      const newLoc = await locationService.create(location);
      setLocations((prev) => [...prev, newLoc]);
      setLocation({ cityName: "", country: "", latitude: "", longitude: "" });
    } catch (error) {
      console.error("Failed to add location:", error);
    }
  };

  const removeLocation = async (id) => {
    try {
      await locationService.delete(id);
      setLocations((prev) => prev.filter((loc) => loc.locationId !== id));
    } catch (error) {
      console.error("Failed to remove location:", error);
    }
  };

  return (
  <div className="locations-dashboard">
    <button className="back-btn" onClick={() => navigate("/admin-dashboard")}>
      ← Back to Dashboard
    </button>

    <h1>Manage Locations</h1>

    {/* Add Location Form */}
    <div className="location-input-card">
      <input
        type="text"
        name="cityName"
        placeholder="City"
        value={location.cityName}
        onChange={handleChange}
      />
      <input
        type="text"
        name="country"
        placeholder="Country"
        value={location.country}
        onChange={handleChange}
      />
      <input
        type="text"
        name="latitude"
        placeholder="Latitude"
        value={location.latitude}
        onChange={handleChange}
      />
      <input
        type="text"
        name="longitude"
        placeholder="Longitude"
        value={location.longitude}
        onChange={handleChange}
      />
      <button className="add-btn" onClick={addLocation}>
        Add Location
      </button>
    </div>

    {/* Current Locations */}
    <h2>Current Locations</h2>
    <div className="locations-grid">
      {locations.map((loc) => (
        <div key={loc.locationId} className="location-card">
          <div
            className="location-info"
            style={{ cursor: "pointer" }}
            onClick={() =>
              navigate("/dashboard", { state: { city: loc.cityName } })
            }
          >
            <p className="location-name">
              {loc.cityName}, {loc.country}
            </p>
            {loc.latitude && loc.longitude && (
              <p>Lat: {loc.latitude}, Lon: {loc.longitude}</p>
            )}
          </div>
          <button onClick={() => removeLocation(loc.locationId)}>Remove</button>
        </div>
      ))}
    </div>
  </div>
);
}
