// src/services/userService.ts (New service for user-related operations)
import { api } from './api';
import type { User, RegisterRequest } from '../types/auth.types';

export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/v1/api/user/allusers');
    return response.data;
  },

  getUserById: async (userId: string): Promise<User> => {
    const response = await api.get(`/v1/api/user/currentuser/${userId}`);
    return response.data;
  },

  updateUser: async (userId: string, userData: RegisterRequest): Promise<void> => {
    await api.put(`/v1/api/user/update/${userId}`, userData);
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/v1/api/user/delete/${userId}`);
  },

  createUser: async (userData: RegisterRequest): Promise<void> => {
    await api.post('/v1/api/user/create', userData);
  },

  // Filter users by role
  getUsersByRole: async (role: string): Promise<User[]> => {
    const allUsers = await userService.getAllUsers();
    return allUsers.filter(user => user.role === role);
  },

  // Get teachers for class assignment
  getTeachers: async (): Promise<User[]> => {
    return await userService.getUsersByRole('teacher');
  },

  // Get students for attendance/class management
  getStudents: async (): Promise<User[]> => {
    return await userService.getUsersByRole('student');
  },

  getStudentsByClass: async (classId: string): Promise<User[]> => {
    const response = await api.get(`/v1/api/class/${classId}/students`);
    return response.data;
  },

  // Search users
  searchUsers: async (searchTerm: string): Promise<User[]> => {
    const allUsers = await userService.getAllUsers();
    const term = searchTerm.toLowerCase();
    return allUsers.filter(user => 
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.username.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  },
};