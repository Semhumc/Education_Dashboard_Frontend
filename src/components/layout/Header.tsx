// src/components/layout/Header.tsx
import React from 'react';
import { Bell, Search, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuths';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import './Header.css'; // Import the new CSS file

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        {/* Search */}
        <div className="search-section">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="right-section">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="notification-button">
            <Bell className="h-5 w-5" />
            <Badge variant="danger" size="sm" className="notification-badge">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <div className="user-menu">
            <div className="user-info">
              <p className="user-name">
                {user?.firstName} {user?.lastName}
              </p>
              <Badge variant="primary" size="sm" className="user-role-badge">
                {user?.role}
              </Badge>
            </div>
            
            <div className="user-actions">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};