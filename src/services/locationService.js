import axios from "axios";

const API_URL = "http://localhost:8080/location"; // Make sure this matches your Spring Boot base URL

const locationService = {
  // Get all locations
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/getAll`);
      return response.data;
    } catch (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
  },

  // Create a new location
  create: async (location) => {
    try {
      const response = await axios.post(`${API_URL}/create`, location);
      return response.data;
    } catch (error) {
      console.error("Error creating location:", error);
      throw error;
    }
  },

  // Delete a location by ID
  delete: async (locationId) => {
    try {
      await axios.delete(`${API_URL}/${locationId}`);
    } catch (error) {
      console.error("Error deleting location:", error);
      throw error;
    }
  },

  // Optional: search location by cityName
  getByCityName: async (cityName) => {
    try {
      const response = await axios.get(`${API_URL}/search?cityName=${cityName}`);
      return response.data;
    } catch (error) {
      console.error("Error searching location:", error);
      return null;
    }
  },
};

export default locationService;
