// src/components/layout/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
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
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center">
          <GraduationCap className="h-8 w-8 text-primary-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">EduDash</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {filteredNavigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={clsx(
                        location.pathname === item.href
                          ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                          : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50',
                        'group flex gap-x-3 rounded-l-md p-2 text-sm leading-6 font-semibold transition-colors'
                      )}
                    >
                      <item.icon
                        className={clsx(
                          location.pathname === item.href 
                            ? 'text-primary-700' 
                            : 'text-gray-400 group-hover:text-primary-700',
                          'h-6 w-6 shrink-0'
                        )}
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
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};