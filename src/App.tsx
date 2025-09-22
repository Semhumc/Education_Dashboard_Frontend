// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuths';

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout';
import { AuthLayout } from './components/layout/AuthLayout';

// Auth Pages
import { LoginPage } from './components/pages/auth/LoginPage';
import { RegisterPage } from './components/pages/auth/RegisterPage';

// Dashboard Pages
import { AdminDashboard } from './components/pages/admin/AdminDashboard';
import { TeacherDashboard } from './components/pages/teacher/TeacherDashboard';
import { StudentDashboard } from './components/pages/student/StudentDashboard';

// Admin Pages
import { ClassManagementPage } from './components/pages/admin/ClassManagementPage';
import { UserManagementPage } from './components/pages/admin/UserManagementPage';

// Teacher Pages
import { TeacherClassesPage } from './components/pages/teacher/TeacherClassesPage';
import { TeacherHomeworkPage } from './components/pages/teacher/TeacherHomeworkPage';

// Protected Route Component
import { ProtectedRoute } from './components/common/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const getDashboardByRole = () => {
    if (!user) return <Navigate to="/login" replace />;
    
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <Navigate to="/login" replace />;
    }
  };

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={getDashboardByRole()} />
          <Route path="/dashboard" element={getDashboardByRole()} />
          
          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="admin">
              <Routes>
                <Route path="classes" element={<ClassManagementPage />} />
                <Route path="users" element={<UserManagementPage />} />
                <Route path="*" element={<Navigate to="classes" replace />} />
              </Routes>
            </ProtectedRoute>
          } />
          
          {/* Teacher Routes */}
          <Route path="/teacher/*" element={
            <ProtectedRoute requiredRole="teacher">
              <Routes>
                <Route path="classes" element={<TeacherClassesPage />} />
                <Route path="homework" element={<TeacherHomeworkPage />} />
                <Route path="*" element={<Navigate to="classes" replace />} />
              </Routes>
            </ProtectedRoute>
          } />
          
          {/* Student Routes */}
          <Route path="/student/*" element={
            <ProtectedRoute requiredRole="student">
              {/* Student specific routes here */}
            </ProtectedRoute>
          } />
        </Route>
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;