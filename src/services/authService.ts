// src/services/authService.ts
import { api } from './api';
import type { LoginRequest, RegisterRequest, User } from '../types/auth.types';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '../store/authStore';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

interface DecodedToken {
  sub: string;
  realm_access?: { roles: string[] };
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse & { user: User }> => {
    console.log('Attempting to log in with credentials:', credentials);
    try {
      const response = await api.post('/v1/api/login', credentials);
      console.log('Login successful, response data:', response.data);
      const { access_token, refresh_token } = response.data;

      const decodedToken = jwtDecode<DecodedToken>(access_token);
      const userId = decodedToken.sub;

      const user = await authService.getCurrentUser(userId);
      
      useAuthStore.getState().setAuth(access_token, refresh_token, user);

      return { access_token, refresh_token, user };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  register: async (userData: RegisterRequest): Promise<void> => {
    await api.post('/v1/api/register', userData);
  },

  logout: async (tokens: { access_token: string; refresh_token: string }): Promise<void> => {
    await api.post('/v1/api/logout', tokens);
  },

  getCurrentUser: async (userId: string): Promise<User> => {
    const response = await api.get(`/v1/api/user/currentuser/${userId}`);
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/v1/api/user/allusers');
    return response.data;
  },

  updateUser: async (userId: string, userData: RegisterRequest): Promise<void> => {
    await api.put(`/v1/api/user/update/${userId}`, userData);
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/v1/api/user/delete/${userId}`);
  }
};