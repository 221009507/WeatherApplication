import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ForecastPage.css';

const Forecast = () => {
  const [city, setCity] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedDay, setSelectedDay] = useState('all');

  useEffect(() => {
    const savedSearches = localStorage.getItem('recentWeatherSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('recentWeatherSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }
   
    setLoading(true);
    setError('');
    setForecastData(null);
    setSelectedDay('all');
   
    try {
      console.log('Searching for 5-day forecast:', city, countryCode);
     
      // First, try to get existing data from our database
      try {
        const response = await axios.get(
          `http://localhost:8080/api/forecast/city/${encodeURIComponent(city)}/country/${countryCode || 'ZA'}`
        );
       
        if (response.data && response.data.length > 0) {
          console.log('Found existing data in database:', response.data.length, 'entries');
          setForecastData(response.data);
          addToRecentSearches(city, countryCode);
          return;
        }
      } catch (getError) {
        console.log('No existing data found, will fetch from API');
      }
     
      // If no existing data, fetch from OpenWeatherMap API
      console.log('Fetching 5-day forecast from OpenWeatherMap API...');
      const createResponse = await axios.post(
        `http://localhost:8080/api/forecast/fetch/${encodeURIComponent(city)}/${countryCode || 'ZA'}`
      );
     
      if (createResponse.data && createResponse.data.length > 0) {
        console.log('5-day forecast fetched from API successfully:', createResponse.data.length, 'entries');
       
        // Now get the saved data from our database
        const response = await axios.get(
          `http://localhost:8080/api/forecast/city/${encodeURIComponent(city)}/country/${countryCode || 'ZA'}`
        );
       
        if (response.data && response.data.length > 0) {
          setForecastData(response.data);
          addToRecentSearches(city, countryCode);
        } else {
          setError('No forecast data found for this location.');
        }
      } else {
        setError('Failed to fetch 5-day forecast data.');
      }
    } catch (err) {
      console.error('Error fetching forecast:', err);
      // ... keep your existing error handling
    } finally {
      setLoading(false);
    }
  };

  // Add this function to group forecasts by day
  const groupForecastsByDay = (forecasts) => {
    if (!forecasts) return {};
   
    const grouped = {};
    forecasts.forEach(forecast => {
      const date = new Date(forecast.forecastTime).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(forecast);
    });
   
    return grouped;
  };

  // Add this function to filter forecasts by selected day
  const getFilteredForecasts = () => {
    if (!forecastData) return [];
   
    if (selectedDay === 'all') {
      return forecastData;
    }
   
    return forecastData.filter(forecast => {
      const forecastDate = new Date(forecast.forecastTime).toDateString();
      return forecastDate === selectedDay;
    });
  };

  // Add this function to get unique days
  const getAvailableDays = () => {
    if (!forecastData) return [];
   
    const days = {};
    forecastData.forEach(forecast => {
      const date = new Date(forecast.forecastTime).toDateString();
      days[date] = true;
    });
   
    return Object.keys(days);
  };

  const addToRecentSearches = (city, countryCode) => {
    const searchTerm = countryCode ? `${city}, ${countryCode}` : city;
    if (!recentSearches.includes(searchTerm)) {
      const updatedSearches = [searchTerm, ...recentSearches.slice(0, 4)];
      setRecentSearches(updatedSearches);
    }
  };

  const handleRecentSearch = (searchTerm) => {
    const parts = searchTerm.split(', ');
    setCity(parts[0]);
    if (parts.length > 1) {
      setCountryCode(parts[1]);
    } else {
      setCountryCode('ZA');
    }
  };

  const formatDate = (dateString) => {
    try {
      const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
      return dateString;
    }
  };

  const formatDay = (dateString) => {
    try {
      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
      return dateString;
    }
  };

  const getWeatherIcon = (condition) => {
    if (!condition) return '🌤️';
   
    const conditionMap = {
      'clear': '☀️', 'clouds': '☁️', 'rain': '🌧️', 'drizzle': '🌦️',
      'thunderstorm': '⛈️', 'snow': '❄️', 'mist': '🌫️', 'smoke': '🌫️',
      'haze': '🌫️', 'dust': '🌫️', 'fog': '🌫️', 'sand': '🌫️',
      'ash': '🌫️', 'squall': '💨', 'tornado': '🌪️'
    };
   
    const lowerCondition = condition.toLowerCase();
    for (const key in conditionMap) {
      if (lowerCondition.includes(key)) {
        return conditionMap[key];
      }
    }
    return '🌤️';
  };

  const testCities = [
    { city: 'London', country: 'GB' },
    { city: 'Paris', country: 'FR' },
    { city: 'New York', country: 'US' },
    { city: 'Tokyo', country: 'JP' },
    { city: 'Cape Town', country: 'ZA' },
    { city: 'Johannesburg', country: 'ZA' },
    { city: 'Durban', country: 'ZA' }
  ];

  const filteredForecasts = getFilteredForecasts();
  const availableDays = getAvailableDays();
  const forecastsByDay = groupForecastsByDay(forecastData);

  return (
    <div className="forecast-container">
      <h1>Weather Forecast</h1>
     
      {/* Search form remains the same */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Country code"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
            style={{ width: '100px' }}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? '⏳ Loading...' : '🔍 Get 5-Day Forecast'}
          </button>
        </div>
      </form>

      {/* Day selection filter */}
      {forecastData && forecastData.length > 0 && (
        <div className="day-filter">
          <h3>Select Day:</h3>
          <div className="day-buttons">
            <button
              className={selectedDay === 'all' ? 'active' : ''}
              onClick={() => setSelectedDay('all')}
            >
              All Days
            </button>
            {availableDays.map((day, index) => (
              <button
                key={index}
                className={selectedDay === day ? 'active' : ''}
                onClick={() => setSelectedDay(day)}
              >
                {formatDay(day)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Forecast display */}
      {filteredForecasts && filteredForecasts.length > 0 && (
        <div className="forecast-results">
          <h2>5-Day Forecast for {filteredForecasts[0].city}</h2>
         
          {selectedDay === 'all' ? (
            // Show grouped by day
            <div className="forecast-days">
              {Object.entries(forecastsByDay).map(([day, dayForecasts]) => (
                <div key={day} className="forecast-day">
                  <h3>{formatDay(day)}</h3>
                  <div className="forecast-cards">
                    {dayForecasts.map((forecast, index) => (
                      <div key={index} className="forecast-card">
                        <div className="card-header">
                          <h4>{formatDate(forecast.forecastTime)}</h4>
                          <span className="weather-icon">{getWeatherIcon(forecast.condition)}</span>
                        </div>
                        <div className="temperature">
                          <span className="main-temp">{Math.round(forecast.temperature)}°C</span>
                          <div className="temp-details">
                            <span>Feels like: {Math.round(forecast.feelsLike)}°C</span>
                          </div>
                        </div>
                        <div className="weather-details">
                          <p className="condition">{forecast.condition}</p>
                          <p className="description">{forecast.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Show single day
            <div className="forecast-cards">
              {filteredForecasts.map((forecast, index) => (
                <div key={index} className="forecast-card">
                  <div className="card-header">
                    <h3>{formatDate(forecast.forecastTime)}</h3>
                    <span className="weather-icon">{getWeatherIcon(forecast.condition)}</span>
                  </div>
                  <div className="temperature">
                    <span className="main-temp">{Math.round(forecast.temperature)}°C</span>
                    <div className="temp-details">
                      <span>Feels like: {Math.round(forecast.feelsLike)}°C</span>
                      <span>Min: {Math.round(forecast.minTemperature)}°C</span>
                      <span>Max: {Math.round(forecast.maxTemperature)}°C</span>
                    </div>
                  </div>
                  <div className="weather-details">
                    <p className="condition">{forecast.condition} - {forecast.description}</p>
                    <div className="details-grid">
                      <div className="detail-item">
                        <span>💧 Humidity:</span>
                        <span>{forecast.humidity}%</span>
                      </div>
                      <div className="detail-item">
                        <span>📊 Pressure:</span>
                        <span>{forecast.pressure}hPa</span>
                      </div>
                      <div className="detail-item">
                        <span>💨 Wind:</span>
                        <span>{forecast.windSpeed}m/s</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Fetching weather data...</p>
        </div>
      )}
    </div>
  );
};

export default Forecast;