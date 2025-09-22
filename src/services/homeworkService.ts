// src/services/homeworkService.ts
import { api } from './api';
import type { Homework } from '../types/auth.types';

export const homeworkService = {
  createHomework: async (homeworkData: Omit<Homework, 'id'>): Promise<void> => {
    await api.post('/v1/api/homework/create', homeworkData);
  },

  getHomeworkById: async (id: string): Promise<Homework> => {
    const response = await api.get(`/v1/api/homework/${id}`);
    return response.data;
  },

  getAllHomeworks: async (): Promise<Homework[]> => {
    const response = await api.get('/v1/api/homework/all');
    return response.data;
  },

  getHomeworksByTeacher: async (teacherId: string): Promise<Homework[]> => {
    const response = await api.get(`/v1/api/homework/teacher/${teacherId}`);
    return response.data;
  },

  getHomeworksByLesson: async (lessonId: string): Promise<Homework[]> => {
    const response = await api.get(`/v1/api/homework/lesson/${lessonId}`);
    return response.data;
  },

  getHomeworksByClass: async (classId: string): Promise<Homework[]> => {
    const response = await api.get(`/v1/api/homework/class/${classId}`);
    return response.data;
  },

  getActiveHomeworks: async (): Promise<Homework[]> => {
    const response = await api.get('/v1/api/homework/active');
    return response.data;
  },

  getOverdueHomeworks: async (): Promise<Homework[]> => {
    const response = await api.get('/v1/api/homework/overdue');
    return response.data;
  },

  getHomeworksDueSoon: async (hours: number = 24): Promise<Homework[]> => {
    const response = await api.get(`/v1/api/homework/due-soon?hours=${hours}`);
    return response.data;
  },

  updateHomework: async (id: string, homeworkData: Partial<Homework>): Promise<void> => {
    await api.put(`/v1/api/homework/update/${id}`, homeworkData);
  },

  deleteHomework: async (id: string): Promise<void> => {
    await api.delete(`/v1/api/homework/delete/${id}`);
  },

  extendDueDate: async (id: string, newDueDate: string): Promise<void> => {
    await api.put(`/v1/api/homework/extend/${id}`, { new_due_date: newDueDate });
  },
};
