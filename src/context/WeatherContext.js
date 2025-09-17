import { createContext, useState } from "react";

export const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [selectedCity, setSelectedCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [locations, setLocations] = useState([]);

  return (
    <WeatherContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        weatherData,
        setWeatherData,
        forecastData,
        setForecastData,
        locations,
        setLocations,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}
