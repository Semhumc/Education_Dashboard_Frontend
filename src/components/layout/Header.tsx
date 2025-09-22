// src/components/layout/Header.tsx
import React from 'react';
import { Bell, Search, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuths';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 py-2 block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          <Badge variant="danger" size="sm" className="absolute -top-0.5 right-0 text-xs">
            3
          </Badge>
        </Button>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              {/* You might replace this with an actual user avatar */}
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div className="ml-3 text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <Badge variant="primary" size="sm" className="mt-0.5">
                {user?.role}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};