import axios from "axios";

const API = axios.create({
  baseURL: "https://xpense-tracker-backend-l6dk.onrender.com", // FastAPI backend
});

// Add Authorization header if token exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
