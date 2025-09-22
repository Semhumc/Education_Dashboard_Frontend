// src/components/layout/AuthLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Calendar, ClipboardList, GraduationCap, UserCheck } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8 lg:bg-gradient-to-br lg:from-primary-600 lg:to-primary-800">
        <div className="mx-auto max-w-md text-center">
          <div className="flex justify-center mb-6">
            <GraduationCap className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Education Dashboard
          </h1>
          <p className="text-xl text-primary-100">
            Streamline your educational management with our comprehensive platform
          </p>
          <div className="mt-8 space-y-4 text-primary-100">
            <div className="flex items-center justify-center space-x-2">
              <UserCheck className="h-5 w-5" />
              <span>Attendance Tracking</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <ClipboardList className="h-5 w-5" />
              <span>Homework Management</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Schedule Planning</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center lg:hidden mb-8">
            <GraduationCap className="mx-auto h-12 w-12 text-primary-600" />
            <h2 className="mt-2 text-2xl font-bold text-gray-900">Education Dashboard</h2>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};