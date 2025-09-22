// src/services/authService.ts
import { api } from './api';
import type { LoginRequest, RegisterRequest, LoginResponse, User } from '../types/auth.types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/v1/api/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<void> => {
    await api.post('/v1/api/create', userData);
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