// src/types/auth.types.ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'Admin' | 'Teacher' | 'Student';
  familyPhone?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string; // Made optional as it might not be in Keycloak token
  role: string;
  familyPhone?: string;
}

// src/types/api.types.ts
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: boolean;
}

export interface Class {
  id: string;
  class_name: string;
  teacher_id: string;
}

export interface Homework {
  id: string;
  teacher_id: string;
  lesson_id: string;
  class_id: string;
  title: string;
  content: string;
  due_date: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  schedule_id: string;
  here: boolean;
  counter: number;
}

export interface Lesson {
  id: string;
  lesson_name: string;
}

export interface Schedule {
  id: string;
  date: string;
  time: string;
  teacher_id: string;
  lesson_id: string;
  class_id: string;
}
