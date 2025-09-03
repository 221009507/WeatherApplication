import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/WeatherDashboard.css";

const API_BASE_URL = "http://localhost:8080/api";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const fetchWeatherData = async (city) => {
    if (!city) return;

    setLoading(true);
    setError("");
    setSelectedCity(city);

    try {
      const weatherRes = await fetch(`${API_BASE_URL}/weather/city=${encodeURIComponent(city)}`);
      if (!weatherRes.ok) throw new Error("City not found");

      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      const generatedForecast = [
        {
          day: "Tomorrow",
          temperature: weatherData.temperature + Math.floor(Math.random() * 5 - 2),
          humidity: 60 + Math.floor(Math.random() * 20),
          windSpeed: 15 + Math.floor(Math.random() * 10),
          description: getRandomCondition(weatherData.condition)
        },
        {
          day: "Day After",
          temperature: weatherData.temperature + Math.floor(Math.random() * 5 - 2),
          humidity: 55 + Math.floor(Math.random() * 25),
          windSpeed: 8 + Math.floor(Math.random() * 12),
          description: getRandomCondition(weatherData.condition)
        },
        {
          day: "In 3 Days",
          temperature: weatherData.temperature + Math.floor(Math.random() * 5 - 2),
          humidity: 65 + Math.floor(Math.random() * 15),
          windSpeed: 12 + Math.floor(Math.random() * 8),
          description: getRandomCondition(weatherData.condition)
        },
      ];
      setForecast(generatedForecast);
      //Mock air quality (OpenWeatherMap API requires paid plan)
      setAirQuality({
        aqi: 30 + Math.floor(Math.random() * 50),
        pm25: 5 + Math.floor(Math.random() * 15),
        pm10: 10 + Math.floor(Math.random() * 20),
        ozone: 0.02 + Math.floor(Math.random() * 0.03)
      });

      setAccuracy({ modelUsed: "ForecastModelX", confidence: 85 + Math.floor(Math.random() * 10) });
    } catch (err) {
      setError("Failed to catch weather data: " + err.message);
      console.error("Error fetching weather data: " + err);
    } finally {
      setLoading(false);
    }
  };

  const getRandomCondition = (current) => {
    const conditions = ["Sunny", "Cloudy", "Rain", "Partly Cloudy", "Clear", "Snow"];
    //70% chance to keep similar condition, 30% to change
    return Math.random() < 0.7 ? current : conditions[Math.floor(Math.random() * conditions.length)];
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
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error-message">{error}</p>}

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
              <p>🕒 {new Date(weather.timestamp.toLocaleString)}</p>
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
              <p>🔹 AQI: {airQuality.aqi} ({getAqiQuality(airQuality.aqi)})</p>
              <p>🔹 PM2.5: {airQuality.pm25}</p>
              <p>🔹 PM10: {airQuality.pm10}</p>
              <p>🔹 Ozone: {airQuality.ozone.toFixed(3)} ppm</p>
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

// helper to interpret AQI value
function getAqiQuality(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}