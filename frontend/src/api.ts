// src/api.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
});

// Request interceptor: attach token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

export default API;
