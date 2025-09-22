// src/services/classService.ts
import { api } from './api';
import type { Class } from '../types/auth.types';

export const classService = {
  createClass: async (classData: Omit<Class, 'id'>): Promise<void> => {
    await api.post('/v1/api/class/create', classData);
  },

  getAllClasses: async (): Promise<Class[]> => {
    const response = await api.get('/v1/api/class/all');
    return response.data;
  },

  getClassesByTeacher: async (teacherId: string): Promise<Class[]> => {
    const response = await api.get(`/v1/api/class/teacher/${teacherId}`);
    return response.data;
  },

  updateClass: async (classId: string, classData: Partial<Class>): Promise<void> => {
    await api.put(`/v1/api/class/update/${classId}`, classData);
  },

  deleteClass: async (classId: string): Promise<void> => {
    await api.delete(`/v1/api/class/delete/${classId}`);
  }
};
