import axios from "axios";

const API_URL = "http://localhost:8080/weather"; // backend URL

const weatherService = {
  // Get live current weather from backend
  getLiveWeather: async (cityName) => {
    if (!cityName) return null;
    try {
      const response = await axios.get(`${API_URL}/current`, {
        params: { city: cityName },
      });
      return response.data; // backend returns Weather object
    } catch (error) {
      console.error("Error fetching live weather:", error);
      return null;
    }
  },

  // Optional: get 10-day forecast
  getForecastByCity: async (cityName) => {
    if (!cityName) return [];
    try {
      const response = await axios.get(`${API_URL}/forecast`, {
        params: { city: cityName },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching forecast:", error);
      return [];
    }
  },

  // Optional: get sunrise/sunset times
  getAstronomyByCity: async (cityName) => {
    if (!cityName) return null;
    try {
      const response = await axios.get(`${API_URL}/astronomy`, {
        params: { city: cityName },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching astronomy data:", error);
      return null;
    }
  },
};

export default weatherService;
