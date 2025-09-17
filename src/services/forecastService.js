import axios from "axios";

const API_URL = "http://localhost:8080/api/forecasts"; // plural to match backend

const forecastService = {
  getByCity: async (city) => {
    try {
      const response = await axios.get(`${API_URL}/${encodeURIComponent(city)}`);
      return response.data; // expects array of Forecast objects
    } catch (error) {
      console.error("Error fetching forecast:", error);
      return [];
    }
  },
};

export default forecastService;