// src/pages/auth/RegisterPage.tsx
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuths';
import { AlertTriangle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Account Registration</h2>
        <p className="mt-2 text-sm text-gray-600">
          Contact your system administrator to create an account
        </p>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Registration Notice
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                New user accounts must be created by system administrators. 
                Please contact your school's IT department or administrative staff 
                to request account creation.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};