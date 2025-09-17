import axios from "axios";

const API_URL = "http://localhost:8080/weather"; // make sure this matches your backend

const weatherService = {
  // Get current weather by city
  getByCityName: async (cityName) => {
    try {
      const response = await axios.get(`${API_URL}/current?city=${cityName}`);
      return response.data; // assuming your backend returns a Weather object or array
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return null;
    }
  },

  // Optional: get 10-day forecast
  getForecastByCity: async (cityName) => {
    try {
      const response = await axios.get(`${API_URL}/forecast?city=${cityName}`);
      return response.data; // array of DailyForecast
    } catch (error) {
      console.error("Error fetching forecast:", error);
      return [];
    }
  },

  // Optional: get sunrise/sunset times
  getAstronomyByCity: async (cityName) => {
    try {
      const response = await axios.get(`${API_URL}/astronomy?city=${cityName}`);
      return response.data; // Astronomy object
    } catch (error) {
      console.error("Error fetching astronomy data:", error);
      return null;
    }
  },
};

export default weatherService;
