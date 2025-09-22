// src/components/layout/DashboardLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-grow ml-64 p-6">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};