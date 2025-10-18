import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const api = axios.create({
  baseURL: BASE_URL,
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- User Endpoints ---
export const loginUser = (profile) => api.post("/users/login", profile);
export const registerUser = (profile) => api.post("/users/register", profile);
export const updateUser = (userId, profile) => api.put(`/users/update/${userId}`, profile);
export const deactivateUser = (userId) => api.put(`/users/deactivate/${userId}`);
export const reactivateUser = (userId) => api.put(`/users/reactivate/${userId}`); // NEW
export const getUserById = (userId) => api.get(`/users/${userId}`);
export const getAllUsers = () => api.get("/users/all");
