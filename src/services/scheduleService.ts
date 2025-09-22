// src/services/scheduleService.ts (Complete version)
import { api } from './api';
import type { Schedule } from '../types/auth.types';

export const scheduleService = {
  createSchedule: async (scheduleData: Omit<Schedule, 'id'>): Promise<void> => {
    await api.post('/v1/api/schedule/create', scheduleData);
  },

  getScheduleById: async (id: string): Promise<Schedule> => {
    const response = await api.get(`/v1/api/schedule/${id}`);
    return response.data;
  },

  getAllSchedules: async (): Promise<Schedule[]> => {
    const response = await api.get('/v1/api/schedule/all');
    return response.data;
  },

  getSchedulesByTeacher: async (teacherId: string): Promise<Schedule[]> => {
    const response = await api.get(`/v1/api/schedule/teacher/${teacherId}`);
    return response.data;
  },

  getSchedulesByClass: async (classId: string): Promise<Schedule[]> => {
    const response = await api.get(`/v1/api/schedule/class/${classId}`);
    return response.data;
  },

  getTodaySchedules: async (): Promise<Schedule[]> => {
    const response = await api.get('/v1/api/schedule/today');
    return response.data;
  },

  getWeekSchedules: async (startDate?: string): Promise<Schedule[]> => {
    const url = startDate 
      ? `/v1/api/schedule/week?start_date=${startDate}` 
      : '/v1/api/schedule/week';
    const response = await api.get(url);
    return response.data;
  },

  getUpcomingSchedules: async (teacherId: string, days: number = 7): Promise<Schedule[]> => {
    const response = await api.get(`/v1/api/schedule/upcoming/${teacherId}?days=${days}`);
    return response.data;
  },

  checkConflicts: async (data: { 
    teacher_id: string; 
    class_id: string; 
    date: string; 
    time: string; 
  }): Promise<Schedule[]> => {
    const response = await api.post('/v1/api/schedule/check-conflicts', data);
    return response.data.conflicts || [];
  },

  reschedule: async (id: string, data: { 
    new_date: string; 
    new_time: string; 
  }): Promise<void> => {
    await api.put(`/v1/api/schedule/reschedule/${id}`, data);
  },

  updateSchedule: async (id: string, scheduleData: Partial<Schedule>): Promise<void> => {
    await api.put(`/v1/api/schedule/update/${id}`, scheduleData);
  },

  deleteSchedule: async (id: string): Promise<void> => {
    await api.delete(`/v1/api/schedule/delete/${id}`);
  },

  // Additional schedule methods
  getSchedulesByDateRange: async (startDate: string, endDate: string): Promise<Schedule[]> => {
    const allSchedules = await scheduleService.getAllSchedules();
    return allSchedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate >= new Date(startDate) && scheduleDate <= new Date(endDate);
    });
  },

  getTeacherScheduleForDay: async (teacherId: string, date: string): Promise<Schedule[]> => {
    const teacherSchedules = await scheduleService.getSchedulesByTeacher(teacherId);
    return teacherSchedules.filter(schedule => 
      schedule.date.split('T')[0] === date.split('T')[0]
    );
  },
};