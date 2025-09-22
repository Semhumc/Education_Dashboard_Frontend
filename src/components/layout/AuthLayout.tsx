// src/components/layout/AuthLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Calendar, ClipboardList, GraduationCap, UserCheck } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 p-4">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6">
        <div className="text-white text-center">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold mt-2">
            Education Dashboard
          </h1>
          <p className="mt-2 text-green-100">
            Streamline your educational management with our comprehensive platform
          </p>
          <div className="mt-6 space-y-3">
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
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-xl">
          <div className="lg:hidden flex items-center justify-center mb-4">
            <GraduationCap className="h-10 w-10 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 ml-3">Education Dashboard</h2>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};