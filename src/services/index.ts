// src/services/index.ts
export { api } from './api';
export { authService } from './authService';
export { classService } from './classService';
export { homeworkService } from './homeworkService';
export { lessonService } from './lessonService';
export { scheduleService } from './scheduleService';
export { attendanceService } from './attendanceService';
export { userService } from './userService';

// Re-export types
export type { 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse, 
  User 
} from '../types/auth.types';

export type { 
  Class, 
  Homework, 
  Lesson, 
  Schedule, 
  Attendance,
  ApiResponse 
} from '../types/auth.types';