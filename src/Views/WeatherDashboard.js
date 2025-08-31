import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/WeatherDashboard.css";

export default function DashboardPage() {
  const routerLocation = useLocation();
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
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (passedCity) fetchWeatherData(passedCity);
  }, [passedCity]);

  const handleSearchChange = (e) => setSearchCity(e.target.value);

  const fetchWeatherData = (city) => {
    if (!city) return;
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

  const addFavorite = () => {
    if (!selectedCity || favorites.includes(selectedCity)) return;
    setFavorites(prev => [...prev, selectedCity]);
  };

  const selectFavorite = (city) => fetchWeatherData(city);

  const removeFavorite = (city) => setFavorites(prev => prev.filter(f => f !== city));

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
          )}

          {accuracy && (
            <div className="accuracy-card">
              <h3>Forecast Accuracy</h3>
              <p>Model: {accuracy.modelUsed}</p>
              <p>Confidence: {accuracy.confidence}%</p>
            </div>
          )}

          {/* --- Favorites Section --- */}
          {favorites.length > 0 && (
            <div className="favorites-list">
              <h3>Favorites</h3>
              {favorites.map((f, idx) => (
                <div key={idx} className="favorite-card">
                  <span onClick={() => selectFavorite(f)} className="fav-name">{f}</span>
                  <button onClick={() => removeFavorite(f)}>Remove</button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}