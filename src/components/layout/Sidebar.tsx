// src/components/layout/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  { name: 'Dashboard', href: '/', icon: Home, roles: ['Admin', 'Teacher', 'Student'] },
  
  // Admin only
  { name: 'User Management', href: '/admin/users', icon: Users, roles: ['Admin'] },
  { name: 'Class Management', href: '/admin/classes', icon: BookOpen, roles: ['Admin'] },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3, roles: ['Admin'] },
  
  // Teacher only
  { name: 'My Classes', href: '/teacher/classes', icon: GraduationCap, roles: ['Teacher'] },
  { name: 'Homework', href: '/teacher/homework', icon: ClipboardList, roles: ['Teacher'] },
  { name: 'Attendance', href: '/teacher/attendance', icon: UserCheck, roles: ['Teacher'] },
  { name: 'Schedule', href: '/teacher/schedule', icon: Calendar, roles: ['Teacher'] },
  { name: 'Lessons', href: '/teacher/lessons', icon: BookOpen, roles: ['Teacher'] },
  
  // Student only
  { name: 'My Homework', href: '/student/homework', icon: ClipboardList, roles: ['Student'] },
  { name: 'My Schedule', href: '/student/schedule', icon: Calendar, roles: ['Student'] },
  { name: 'My Attendance', href: '/student/attendance', icon: UserCheck, roles: ['Student'] },
  
  // Common
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['Admin', 'Teacher', 'Student'] },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  
  const userRole = user?.role || '';
  const filteredNavigation = navigation.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col fixed h-screen z-50 p-4">
      <div className="flex flex-col flex-1">
        {/* Logo */}
        <div className="flex items-center mb-8 pl-2">
          <GraduationCap className="h-8 w-8" />
          <span className="text-xl font-semibold ml-3">EduDash</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col space-y-2">
          <ul role="list" className="-mx-2 space-y-1">
            <li>
              <ul role="list" className="space-y-1">
                {filteredNavigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white ${location.pathname === item.href ? 'bg-gray-700 text-white' : ''}`}
                    >
                      <item.icon
                        className={`h-5 w-5 mr-3 ${location.pathname === item.href ? 'text-white' : 'text-gray-300'}`}
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
        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Users className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};