// src/services/lessonService.ts (Complete version)
import { api } from './api';
import type { Lesson } from '../types/auth.types';

export const lessonService = {
  createLesson: async (lessonData: Omit<Lesson, 'id'>): Promise<void> => {
    await api.post('/v1/api/lesson/create', lessonData);
  },

  getLessonById: async (id: string): Promise<Lesson> => {
    const response = await api.get(`/v1/api/lesson/${id}`);
    return response.data;
  },

  getAllLessons: async (): Promise<Lesson[]> => {
    const response = await api.get('/v1/api/lesson/all');
    return response.data;
  },

  updateLesson: async (id: string, lessonData: Partial<Lesson>): Promise<void> => {
    await api.put(`/v1/api/lesson/update/${id}`, lessonData);
  },

  deleteLesson: async (id: string): Promise<void> => {
    await api.delete(`/v1/api/lesson/delete/${id}`);
  },

  // Additional lesson methods
  searchLessons: async (searchTerm: string): Promise<Lesson[]> => {
    const allLessons = await lessonService.getAllLessons();
    return allLessons.filter(lesson => 
      lesson.lesson_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },

  getLessonStats: async (): Promise<{
    homeworkCount: number;
    scheduleCount: number;
  }> => {
    // This would require additional API endpoints or client-side calculation
    // For now, returning mock data
    return {
      homeworkCount: 0,
      scheduleCount: 0,
    };
  },
};

