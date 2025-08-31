import { useState, useEffect } from "react";
import "../styles/ForecastPage.css";

export default function ForecastPage() {
  const [forecastData, setForecastData] = useState([]);
  const [accuracyData, setAccuracyData] = useState([]);

  // Load mock data
  useEffect(() => {
    setForecastData([
      { id: "f1", day: "Tomorrow", temperature: 24, humidity: 60, windSpeed: 12, description: "Sunny" },
      { id: "f2", day: "Day After", temperature: 22, humidity: 55, windSpeed: 10, description: "Cloudy" },
      { id: "f3", day: "In 3 Days", temperature: 25, humidity: 65, windSpeed: 8, description: "Rain" },
    ]);

    setAccuracyData([
      {
        id: "a1",
        forecastRecords: ["Sunny, 25°C", "Humidity 60%", "Wind 10km/h"],
        accuracyScore: 92,
        forecastDay: "Tomorrow",
      },
      {
        id: "a2",
        forecastRecords: ["Cloudy, 22°C", "Humidity 55%", "Wind 12km/h"],
        accuracyScore: 88,
        forecastDay: "Day After",
      },
      {
        id: "a3",
        forecastRecords: ["Rain, 25°C", "Humidity 65%", "Wind 8km/h"],
        accuracyScore: 85,
        forecastDay: "In 3 Days",
      },
    ]);
  }, []);

  const getAccuracyForDay = (day) => accuracyData.find(a => a.forecastDay === day);

  return (
    <div className="forecast-page">
      <h1>Forecast Dashboard 🌤️</h1>

      <section>
        <h2>Upcoming Forecast</h2>
        <div className="forecast-grid">
          {forecastData.map(f => {
            const accuracy = getAccuracyForDay(f.day);
            return (
              <div key={f.id} className="forecast-card">
                <h3>{f.day}</h3>
                <p>🌡 Temp: {f.temperature}°C</p>
                <p>💧 Humidity: {f.humidity}%</p>
                <p>💨 Wind: {f.windSpeed} km/h</p>
                <p>☁️ {f.description}</p>

                {accuracy && (
                  <div className="accuracy-section">
                    <p>📊 Accuracy Score: {accuracy.accuracyScore}%</p>
                    <p>📝 Records:</p>
                    <ul>
                      {accuracy.forecastRecords.map((rec, idx) => (
                        <li key={idx}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}