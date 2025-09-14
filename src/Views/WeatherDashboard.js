import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/WeatherDashboard.css";

export default function DashboardPage() {
  const routerLocation = useLocation();
  const navigate = useNavigate();

  const role = routerLocation.state?.role || "USER";
  const firstName = routerLocation.state?.firstName || "User";
  const passedCity = routerLocation.state?.city || "";

  const [searchCity, setSearchCity] = useState(passedCity);
  const [selectedCity, setSelectedCity] = useState(passedCity);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [airQuality, setAirQuality] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
  }, []);

  useEffect(() => {
    if (role === "ADMIN") navigate("/admin-dashboard");
  }, [role, navigate]);

  useEffect(() => {
    if (passedCity) fetchWeatherData(passedCity);
  }, [passedCity]);

  const handleSearchChange = (e) => setSearchCity(e.target.value);

  const fetchWeatherData = async (city) => {
    if (!city) return;

    setLoading(true);
    setError("");
    setSelectedCity(city);

    // Mock Weather Data
    setWeather({
      city,
      temperature: 26,
      condition: "Partly Cloudy",
      timestamp: new Date().toLocaleString(),
      location: "City Center",
    });

    setForecast([
      { day: "Tomorrow", temperature: 24, humidity: 60, windSpeed: 12, description: "Sunny" },
      { day: "Day After", temperature: 22, humidity: 55, windSpeed: 10, description: "Cloudy" },
      { day: "In 3 Days", temperature: 25, humidity: 65, windSpeed: 8, description: "Rain" },
    ]);

    setAirQuality({ aqi: 42, pm25: 12, pm10: 25, ozone: 0.03 });
    setAccuracy({ modelUsed: "ForecastModelX", confidence: 92 });
  };

  const handleSearch = () => fetchWeatherData(searchCity);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="dashboard-page">
      <h1>Weather Dashboard 🌤️</h1>

      {/* --- Search Section --- */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city..."
          value={searchCity}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* --- Weather Display --- */}
      {selectedCity && (
        <section className="weather-section">
          <div className="weather-header">
            <h2>{selectedCity} Weather</h2>
            <button onClick={addFavorite} className="add-fav-btn">⭐ Add to Favorites</button>
          </div>

          {weather && (
            <div className="weather-card">
              <h3>{weather.city}</h3>
              <p>🌡️ {weather.temperature}°C</p>
              <p>☁️ {weather.condition}</p>
              <p>📍 {weather.location}</p>
              <p>🕒 {weather.timestamp}</p>
            </div>
          )}

          {forecast.length > 0 && (
            <div className="forecast-grid">
              {forecast.map((f, idx) => (
                <div key={idx} className="forecast-card">
                  <h4>{f.day}</h4>
                  <p>🌡️ {f.temperature}°C</p>
                  <p>💧 {f.humidity}% Humidity</p>
                  <p>💨 {f.windSpeed} km/h Wind</p>
                  <p>☁️ {f.description}</p>
                </div>
              ))}
            </div>
          )}

          {airQuality && (
            <div className="air-quality-card">
              <h3>Air Quality Index</h3>
              <p>🔹 AQI: {airQuality.aqi}</p>
              <p>🔹 PM2.5: {airQuality.pm25}</p>
              <p>🔹 PM10: {airQuality.pm10}</p>
              <p>🔹 Ozone: {airQuality.ozone}</p>
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