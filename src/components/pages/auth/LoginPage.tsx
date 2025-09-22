// src/pages/auth/LoginPage.tsx
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { LoginForm } from '../../forms/LoginForm';
import { useAuth } from '../../../hooks/useAuths';

export const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Access your education dashboard
        </p>
      </div>
      
      <LoginForm />
      
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