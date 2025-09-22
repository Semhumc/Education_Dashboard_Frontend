// src/components/layout/DashboardLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import './DashboardLayout.css';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="dashboard-layout-container">
      <Sidebar />
      <div className="dashboard-main-content">
        <Header />
        <main className="dashboard-main-padding">
          <Outlet />
        </main>
      </div>
    </div>
  );
};