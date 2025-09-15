import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

export default function DashboardPage() {
  const routerLocation = useLocation();
  const navigate = useNavigate();

  const role = routerLocation.state?.role || "USER";
    // Get firstName from localStorage
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

  useEffect(() => {
    if (role === "ADMIN") navigate("/admin-dashboard");
  }, [role, navigate]);

  useEffect(() => {
    if (passedCity) fetchWeatherData(passedCity);
  }, [passedCity]);

  const handleSearchChange = (e) => setSearchCity(e.target.value);

  const fetchWeatherData = (city) => {
    if (!city) return;
    setSelectedCity(city);
    setWeather({
      city,
      temperature: 24,
      feelsLike: 27,
      condition: "Partly Cloudy",
      wind: "12 km/h",
      visibility: "16 km",
      humidity: "65%",
      pressure: "1013 hPa",
      uvIndex: 6,
    });

    // update recent searches
    setRecentSearches((prev) => {
      const updated = [city, ...prev.filter((c) => c !== city)];
      return updated.slice(0, 5); // keep only last 5
    });
  };

  const handleSearch = () => fetchWeatherData(searchCity);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <Sidebar onLogout={handleLogout} />
      <main className="main-content">
        {/* Search Section (Top / North) */}
        <section className="search-section">
          <h1>Weather Search</h1>
            <p>
              Welcome, <strong>{firstName}</strong>! Find real-time weather conditions worldwide.
            </p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchCity}
              onChange={handleSearchChange}
            />
            <button onClick={handleSearch}>🔍</button>
          </div>

          {/* Recent Searches */}
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

        {/* Weather Card (Bottom / South) */}
        {weather && (
          <section className="weather-card">
            <div className="weather-info">
              <h2>{selectedCity || weather.city}</h2>
              <p className="temp">{weather.temperature}°</p>
              <p className="condition">{weather.condition}</p>
              <p>Feels like {weather.feelsLike}°</p>
              <p>Wind: {weather.wind}</p>
              <p>Visibility: {weather.visibility}</p>
            </div>
            <div className="weather-stats">
              <p>💧 Humidity: {weather.humidity}</p>
              <p>🌡️ Pressure: {weather.pressure}</p>
              <p>☀️ UV Index: {weather.uvIndex}</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
