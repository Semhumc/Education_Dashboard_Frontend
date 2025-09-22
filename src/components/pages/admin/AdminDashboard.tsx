// src/pages/admin/AdminDashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, BookOpen, ClipboardList, TrendingUp, Calendar, UserCheck } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { authService } from '../../../services/authService';
import { classService } from '../../../services/classService';
import { homeworkService } from '../../../services/homeworkService';
import { scheduleService } from '../../../services/scheduleService';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    red: 'text-red-600 bg-red-100',
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className={`h-4 w-4 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`} />
              <span className={`text-sm font-medium ml-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};

export const AdminDashboard: React.FC = () => {
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: authService.getAllUsers,
  });

  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: classService.getAllClasses,
  });

  const { data: homeworks = [] } = useQuery({
    queryKey: ['homeworks'],
    queryFn: homeworkService.getAllHomeworks,
  });

  const { data: todaySchedules = [] } = useQuery({
    queryKey: ['today-schedules'],
    queryFn: scheduleService.getTodaySchedules,
  });

  const stats = {
    totalUsers: users.length,
    totalClasses: classes.length,
    totalHomeworks: homeworks.length,
    todayClasses: todaySchedules.length,
    teachers: users.filter(user => user.role === 'teacher').length,
    students: users.filter(user => user.role === 'student').length,
    activeHomeworks: homeworks.filter(hw => new Date(hw.due_date) > new Date()).length,
    overdueHomeworks: homeworks.filter(hw => new Date(hw.due_date) < new Date()).length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your education management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend={{ value: "+12%", isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Active Classes"
          value={stats.totalClasses}
          icon={BookOpen}
          trend={{ value: "+8%", isPositive: true }}
          color="green"
        />
        <StatCard
          title="Total Homework"
          value={stats.totalHomeworks}
          icon={ClipboardList}
          color="yellow"
        />
        <StatCard
          title="Today's Classes"
          value={stats.todayClasses}
          icon={Calendar}
          color="red"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.teachers}</p>
            <p className="text-sm text-gray-600">Teachers</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.students}</p>
            <p className="text-sm text-gray-600">Students</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.activeHomeworks}</p>
            <p className="text-sm text-gray-600">Active Homework</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{stats.overdueHomeworks}</p>
            <p className="text-sm text-gray-600">Overdue Homework</p>
          </div>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Manage Users</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-green-600" />
                <span className="font-medium">Manage Classes</span>
              </div>
            </button>
            <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span className="font-medium">View Reports</span>
              </div>
            </button>
          </div>
        </Card>

        {/* Recent Users */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h3>
          <div className="space-y-3">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'teacher' ? 'warning' : 'primary'}>
                  {user.role}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};