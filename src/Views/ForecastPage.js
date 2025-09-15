import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/ForecastPage.css";

const API_KEY = "854334a6547bd881a0ae9511d82da8d0"; // Replace with your key

const ForecastPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [forecast, setForecast] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    if (!state || !state.city) {
      navigate("/weather");
      return;
    }

    async function fetchForecast() {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${state.city}&units=metric&appid=${API_KEY}`
        );

        if (!res.data.list) {
          alert("No forecast data found.");
          return;
        }

        const days = {};
        res.data.list.forEach((item) => {
          const date = new Date(item.dt_txt).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
          if (!days[date]) days[date] = [];
          days[date].push(item);
        });

        const daily = Object.entries(days).map(([date, data]) => ({
          date,
          tempMax: Math.max(...data.map((d) => d.main.temp_max)),
          tempMin: Math.min(...data.map((d) => d.main.temp_min)),
          pop: Math.round((data[0].pop || 0) * 100),
          icon: data[0].weather[0].icon,
          description: data[0].weather[0].main,
          details: data,
        }));

        setForecast(res.data);
        setDailyData(daily);
        setSelectedDay(daily[0]);
      } catch (err) {
        console.error("Forecast fetch error:", err);
        alert("Could not fetch forecast. Try again.");
      }
    }

    fetchForecast();
  }, [state, navigate]);

  if (!forecast)
    return (
      <div className="loading-container">
        <p className="loading-text">Loading forecast data...</p>
      </div>
    );

  return (
    <div className="forecast-container">
      <div className="forecast-header">
        <h1>Weather Forecast for <span className="city-name">{state.city}</span></h1>
      </div>

      {/* Forecast Cards */}
      <div className="forecast-grid">
        {dailyData.map((day, index) => (
          <div
            key={index}
            onClick={() => setSelectedDay(day)}
            className={`forecast-card ${selectedDay?.date === day.date ? 'selected' : ''}`}
          >
            <h3>{day.date}</h3>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt={day.description}
              className="weather-icon"
            />
            <div className="temperature">
              {Math.round(day.tempMax)}° / {Math.round(day.tempMin)}°
            </div>
            <p className="precipitation">{day.pop}% chance of rain</p>
          </div>
        ))}
      </div>

      {/* Selected Day Details */}
      {selectedDay && (
        <div className="weather-details">
          <h2>{selectedDay.date} - Detailed Forecast</h2>
          <div className="detail-item">
            <span className="detail-label">Maximum Temperature:</span>
            <span className="detail-value">{Math.round(selectedDay.tempMax)}°C</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Minimum Temperature:</span>
            <span className="detail-value">{Math.round(selectedDay.tempMin)}°C</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Weather Condition:</span>
            <span className="detail-value">{selectedDay.description}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Chance of Precipitation:</span>
            <span className="detail-value">{selectedDay.pop}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastPage;
