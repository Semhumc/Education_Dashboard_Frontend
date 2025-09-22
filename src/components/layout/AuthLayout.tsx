// src/components/layout/AuthLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Calendar, ClipboardList, GraduationCap, UserCheck } from 'lucide-react';
import './AuthLayout.css';

export const AuthLayout: React.FC = () => {
  return (
    <div className="auth-layout-container">
      {/* Left side - Branding */}
      <div className="auth-layout-left">
        <div className="auth-layout-left-content">
          <div className="auth-layout-logo-wrapper">
            <GraduationCap className="auth-layout-logo" />
          </div>
          <h1 className="auth-layout-title">
            Education Dashboard
          </h1>
          <p className="auth-layout-subtitle">
            Streamline your educational management with our comprehensive platform
          </p>
          <div className="auth-layout-features">
            <div className="auth-layout-feature-item">
              <UserCheck className="auth-layout-feature-icon" />
              <span>Attendance Tracking</span>
            </div>
            <div className="auth-layout-feature-item">
              <ClipboardList className="auth-layout-feature-icon" />
              <span>Homework Management</span>
            </div>
            <div className="auth-layout-feature-item">
              <Calendar className="auth-layout-feature-icon" />
              <span>Schedule Planning</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="auth-layout-right">
        <div className="auth-layout-form-wrapper">
          <div className="auth-layout-mobile-header">
            <GraduationCap className="auth-layout-mobile-logo" />
            <h2 className="auth-layout-mobile-title">Education Dashboard</h2>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};