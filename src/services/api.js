import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const api = axios.create({
  baseURL: BASE_URL,
});

// User endpoints
export const loginUser = (profile) => api.post("/users/login", profile);
export const registerUser = (profile) => api.post("/users/register", profile);
export const updateUser = (profile) => api.put("/users/update", profile);
export const deleteUser = (userId) => api.delete(`/users/delete/${userId}`);
export const getUserById = (userId) => api.get(`/users/${userId}`);
export const getAllUsers = () => api.get("/users/all");
