import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import weatherService from "../services/weatherService";
import "../styles/WeatherDashboard.css";

function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { name: "Weather", path: "/dashboard" },
    { name: "Forecast", path: "/forecast" },
    { name: "Alerts", path: "/alerts" },
    { name: "Profile", path: "/profile" },
    { name: "Subscription", path: "/subscriptions" },
    { name: "Locations", path: "/locations" },
  ];

  return (
    <aside className="sidebar">
      <h2 className="sidebar-logo">WeatherPro</h2>
      <p className="sidebar-subtitle">Advanced Weather</p>
      <ul className="sidebar-links">
        {links.map((link) => (
          <li
            key={link.path}
            className={location.pathname === link.path ? "active" : ""}
            onClick={() => navigate(link.path)}
          >
            {link.name}
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <button onClick={onLogout}>Sign Out</button>
      </div>
    </aside>
  );
}

export default function WeatherDashboard() {
  const routerLocation = useLocation();
  const navigate = useNavigate();

  const role = routerLocation.state?.role || "USER";

  // Get user first name from localStorage
  let firstName = "User";
  const storedProfile = localStorage.getItem("userProfile");
  if (storedProfile) {
    try {
      const parsed = JSON.parse(storedProfile);
      if (parsed.firstName) firstName = parsed.firstName;
    } catch {}
  }

  const passedCity = routerLocation.state?.city || "";

  const [searchCity, setSearchCity] = useState(passedCity);
  const [selectedCity, setSelectedCity] = useState(passedCity);
  const [weather, setWeather] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  // Redirect admin to admin dashboard
  useEffect(() => {
    if (role === "ADMIN") navigate("/admin-dashboard");
  }, [role, navigate]);

  // Fetch weather on initial city
  useEffect(() => {
    if (passedCity) fetchWeatherData(passedCity);
  }, [passedCity]);

  const handleSearchChange = (e) => setSearchCity(e.target.value);

  const fetchWeatherData = async (city) => {
    if (!city) return;
    setSelectedCity(city);

    try {
      const w = await weatherService.getLiveWeather(city);
      if (!w) return;

      setWeather({
        city: w.location.cityName,
        temperature: w.temperatureCurrent,
        feelsLike: w.feelsLike,
        condition: w.condition,
        wind: `${w.windSpeed} km/h`,
        visibility: w.visibility ? `${(w.visibility / 1000).toFixed(1)} km` : "N/A",
        humidity: `${w.humidity}%`,
        pressure: w.pressure !== undefined ? `${w.pressure} hPa` : "1013 hPa",
        uvIndex: w.uvIndex ?? 0,
      });

      setRecentSearches((prev) => {
        const updated = [city.trim(), ...prev.filter((c) => c.trim() !== city.trim())];
        return updated.slice(0, 5);
      });
    } catch (error) {
      console.error("Failed to fetch live weather data:", error);
    }
  };

  const handleSearch = () => fetchWeatherData(searchCity);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const conditionIcons = {
    cloud: "☁️",
    rain: "🌧️",
    storm: "⛈️",
    snow: "❄️",
    fog: "🌫️",
    mist: "🌫️",
  };

  const getWeatherIcon = (condition) => {
    if (!condition) return "☀️";
    const cond = condition.toLowerCase();
    for (const key in conditionIcons) {
      if (cond.includes(key)) return conditionIcons[key];
    }
    return "☀️";
  };

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={handleLogout} />
      <main className="main-content">
        <section className="search-section">
          <h1>Weather Search</h1>
          <p>
            Welcome, <strong>{firstName}</strong>! Check real-time weather worldwide.
          </p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchCity}
              onChange={handleSearchChange}
            />
            <button onClick={handleSearch} disabled={!searchCity}>
              🔍
            </button>
          </div>

          {recentSearches.length > 0 && (
            <div className="recent-searches">
              <h3>Recent Searches</h3>
              <ul>
                {recentSearches.map((city, index) => (
                  <li key={index} onClick={() => fetchWeatherData(city)}>
                    {city}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {weather && (
          <section className={`weather-card ${weather.condition?.toLowerCase()}`}>
            <div className="weather-header">
              <div className="weather-icon">{getWeatherIcon(weather.condition)}</div>
              <h2>{selectedCity || weather.city}</h2>
            </div>

            <div className="weather-main">
              <p className="temp">{weather.temperature}°</p>
              <p className="condition">{weather.condition}</p>
              <p className="feels-like">Feels like {weather.feelsLike}°</p>
            </div>

            <div className="weather-stats">
              <p>💧 Humidity: {weather.humidity}</p>
              <p>🌡️ Pressure: {weather.pressure}</p>
              <p>💨 Wind: {weather.wind}</p>
              <p>👁️ Visibility: {weather.visibility}</p>
              <p>☀️ UV Index: {weather.uvIndex}</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
