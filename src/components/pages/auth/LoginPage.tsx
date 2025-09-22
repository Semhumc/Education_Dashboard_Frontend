// src/pages/auth/LoginPage.tsx
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { LoginForm } from '../../forms/LoginForm';
import { RoleSelector } from '../../forms/RoleSelector';
import { useAuth } from '../../../hooks/useAuths';
import { useAuthStore } from '../../../store/authStore';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Teacher' | 'Student' | null>(null);

  if (isAuthenticated && user) {
    // Redirect based on the user's actual role after successful login
    switch (user.role) {
      case 'Admin':
        return <Navigate to="/admin/dashboard" replace />;
      case 'Teacher':
        return <Navigate to="/teacher/dashboard" replace />;
      case 'Student':
        return <Navigate to="/student/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  const handleRoleSelect = (role: 'Admin' | 'Teacher' | 'Student') => {
    setSelectedRole(role);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Access your education dashboard
        </p>
      </div>
      
      {!selectedRole ? (
        <RoleSelector onSelectRole={handleRoleSelect} />
      ) : (
        <LoginForm />
      )}
      
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            Contact your administrator
          </Link>
        </p>
      </div>
    </div>
  );
};