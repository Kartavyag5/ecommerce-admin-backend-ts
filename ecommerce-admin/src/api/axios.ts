import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api', // adjust if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
