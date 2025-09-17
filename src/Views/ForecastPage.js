import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import forecastService from "../services/forecastService";
import "../styles/ForecastPage.css";

export default function ForecastPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const passedCity = location.state?.city || "";

  const [selectedCity, setSelectedCity] = useState(passedCity);
  const [forecasts, setForecasts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Stable handleSearch using useCallback
  const handleSearch = useCallback(async () => {
    // Move availableCities inside useCallback to satisfy ESLint
    const availableCities = [
      "Johannesburg",
      "Cape Town",
      "George",
      "East London",
      "Durban"
    ];

    if (!availableCities.includes(selectedCity)) {
      setForecasts([]);
      setErrorMessage("City not available.");
      return;
    }

    try {
      const data = await forecastService.getByCity(selectedCity);
      setForecasts(data.slice(0, 3)); // show first 3 forecasts
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to fetch forecasts:", error);
      setForecasts([]);
      setErrorMessage("Failed to fetch forecasts.");
    }
  }, [selectedCity]);

  // Run on initial load if passedCity exists
  useEffect(() => {
    if (passedCity) handleSearch();
  }, [passedCity, handleSearch]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setErrorMessage(""); // reset error on input change
  };

  return (
    <div className="forecast-container">
      <main className="forecast-main">
        <section className="forecast-search">
          <h1>Forecast</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter a city..."
              value={selectedCity}
              onChange={handleCityChange}
            />
            <button onClick={handleSearch}>🔍</button>
            <button onClick={() => navigate("/dashboard")}>← Back</button>
          </div>
          {errorMessage && <p className="error">{errorMessage}</p>}
        </section>

        <section className="forecast-details">
          {forecasts.length === 0 && !errorMessage && (
            <p>No forecasts available for this city.</p>
          )}
          {forecasts.map((f, index) => (
            <div key={index} className="forecast-fields">
              <h2>Forecast {index + 1}</h2>
              <p><strong>Forecast Time:</strong> {f.forecastTime}</p>
              <p><strong>Temperature:</strong> {f.temperature.toFixed(1)}°C</p>
              <p><strong>Feels Like:</strong> {f.feelsLike.toFixed(1)}°C</p>
              <p><strong>Condition:</strong> {f.condition}</p>
              <p><strong>Wind Speed:</strong> {f.windSpeed.toFixed(1)} km/h</p>
              <p><strong>Humidity:</strong> {f.humidity}%</p>
              <p><strong>Pressure:</strong> {f.pressure} hPa</p>
              <p><strong>UV Index:</strong> {f.uvIndex.toFixed(1)}</p>
              <hr />
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
