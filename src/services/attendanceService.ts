// src/services/attendanceService.ts
import { api } from './api';
import type { Attendance } from '../types/auth.types';

export const attendanceService = {
  createAttendance: async (attendanceData: Omit<Attendance, 'id'>): Promise<void> => {
    await api.post('/v1/api/attendance/create', attendanceData);
  },

  getAttendanceById: async (id: string): Promise<Attendance> => {
    const response = await api.get(`/v1/api/attendance/${id}`);
    return response.data;
  },

  getAttendanceByStudent: async (studentId: string): Promise<Attendance[]> => {
    const response = await api.get(`/v1/api/attendance/student/${studentId}`);
    return response.data;
  },

  getAttendanceBySchedule: async (scheduleId: string): Promise<Attendance[]> => {
    const response = await api.get(`/v1/api/attendance/schedule/${scheduleId}`);
    return response.data;
  },

  markAttendance: async (data: { 
    student_id: string; 
    schedule_id: string; 
    is_present: boolean; 
  }): Promise<void> => {
    await api.post('/v1/api/attendance/mark', data);
  },

  updateAttendance: async (id: string, attendanceData: Partial<Attendance>): Promise<void> => {
    await api.put(`/v1/api/attendance/update/${id}`, attendanceData);
  },

  deleteAttendance: async (id: string): Promise<void> => {
    await api.delete(`/v1/api/attendance/delete/${id}`);
  },

  // Attendance rate calculation
  getAttendanceRate: async (studentId: string): Promise<number> => {
    const attendances = await attendanceService.getAttendanceByStudent(studentId);
    if (attendances.length === 0) return 0;
    
    const presentCount = attendances.filter(att => att.here).length;
    return Math.round((presentCount / attendances.length) * 100);
  },

  // Bulk attendance marking for a schedule
  markBulkAttendance: async (scheduleId: string, attendanceList: Array<{
    student_id: string;
    is_present: boolean;
  }>): Promise<void> => {
    const promises = attendanceList.map(attendance => 
      attendanceService.markAttendance({
        student_id: attendance.student_id,
        schedule_id: scheduleId,
        is_present: attendance.is_present,
      })
    );
    
    await Promise.all(promises);
  },
};