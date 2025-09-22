// src/components/layout/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css'; // Import the new CSS file
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  ClipboardList, 
  UserCheck,
  Settings,
  BarChart3,
  GraduationCap
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: Home, roles: ['admin', 'teacher', 'student'] },
  
  // Admin only
  { name: 'User Management', href: '/admin/users', icon: Users, roles: ['admin'] },
  { name: 'Class Management', href: '/admin/classes', icon: BookOpen, roles: ['admin'] },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3, roles: ['admin'] },
  
  // Teacher only
  { name: 'My Classes', href: '/teacher/classes', icon: GraduationCap, roles: ['teacher'] },
  { name: 'Homework', href: '/teacher/homework', icon: ClipboardList, roles: ['teacher'] },
  { name: 'Attendance', href: '/teacher/attendance', icon: UserCheck, roles: ['teacher'] },
  { name: 'Schedule', href: '/teacher/schedule', icon: Calendar, roles: ['teacher'] },
  { name: 'Lessons', href: '/teacher/lessons', icon: BookOpen, roles: ['teacher'] },
  
  // Student only
  { name: 'My Homework', href: '/student/homework', icon: ClipboardList, roles: ['student'] },
  { name: 'My Schedule', href: '/student/schedule', icon: Calendar, roles: ['student'] },
  { name: 'My Attendance', href: '/student/attendance', icon: UserCheck, roles: ['student'] },
  
  // Common
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin', 'teacher', 'student'] },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  
  const userRole = user?.role || '';
  const filteredNavigation = navigation.filter(item => item.roles.includes(userRole));

  return (
    <div className="sidebar-container">
      <div className="sidebar-content">
        {/* Logo */}
        <div className="sidebar-logo-section">
          <GraduationCap className="sidebar-logo-icon" />
          <span className="sidebar-logo-text">EduDash</span>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul role="list" className="sidebar-nav-list">
            <li>
              <ul role="list" className="sidebar-nav-item-list">
                {filteredNavigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`sidebar-nav-link ${location.pathname === item.href ? 'sidebar-nav-link-active' : 'sidebar-nav-link-inactive'}`}
                    >
                      <item.icon
                        className={`sidebar-nav-icon ${location.pathname === item.href ? 'sidebar-nav-icon-active' : 'sidebar-nav-icon-inactive'}`}
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>

        {/* User info */}
        <div className="sidebar-user-section">
          <div className="sidebar-user-info">
            <div className="sidebar-user-avatar-wrapper">
              <div className="sidebar-user-avatar">
                <Users className="sidebar-user-avatar-icon" />
              </div>
            </div>
            <div className="sidebar-user-details">
              <p className="sidebar-user-name">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="sidebar-user-role">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};