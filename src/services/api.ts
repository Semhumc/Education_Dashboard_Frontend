// src/services/api.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL =  'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    console.log('API Interceptor - Current token:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API Interceptor - Adding Authorization header:', config.headers.Authorization);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);