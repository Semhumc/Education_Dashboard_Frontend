// src/pages/admin/AdminDashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, BookOpen, ClipboardList, TrendingUp, Calendar } from 'lucide-react';
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
    blue: 'stat-card-icon-blue',
    green: 'stat-card-icon-green',
    yellow: 'stat-card-icon-yellow',
    red: 'stat-card-icon-red',
  };

  return (
    <Card className="stat-card-content">
      <div className="stat-card-header">
        <div>
          <p className="stat-card-title">{title}</p>
          <p className="stat-card-value">{value}</p>
          {trend && (
            <div className="stat-card-trend">
              <TrendingUp className={`stat-card-trend-icon ${trend.isPositive ? 'stat-card-trend-positive' : 'stat-card-trend-negative'}`} />
              <span className={`stat-card-trend-text ${trend.isPositive ? 'stat-card-trend-text-positive' : 'stat-card-trend-text-negative'}`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className={`stat-card-icon-wrapper ${colorClasses[color]}`}>
          <Icon className="stat-card-icon" />
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
    <div className="admin-dashboard-container">
      {/* Page Header */}
      <div className="admin-dashboard-header">
        <h1 className="admin-dashboard-title">Admin Dashboard</h1>
        <p className="admin-dashboard-subtitle">Overview of your education management system</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
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
      <div className="secondary-stats-grid">
        <Card className="secondary-stat-card-content">
          <div className="text-center">
            <p className="secondary-stat-value-blue">{stats.teachers}</p>
            <p className="secondary-stat-label">Teachers</p>
          </div>
        </Card>
        <Card className="secondary-stat-card-content">
          <div className="text-center">
            <p className="secondary-stat-value-green">{stats.students}</p>
            <p className="secondary-stat-label">Students</p>
          </div>
        </Card>
        <Card className="secondary-stat-card-content">
          <div className="text-center">
            <p className="secondary-stat-value-yellow">{stats.activeHomeworks}</p>
            <p className="secondary-stat-label">Active Homework</p>
          </div>
        </Card>
        <Card className="secondary-stat-card-content">
          <div className="text-center">
            <p className="secondary-stat-value-red">{stats.overdueHomeworks}</p>
            <p className="secondary-stat-label">Overdue Homework</p>
          </div>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="quick-actions-recent-activity-grid">
        {/* Quick Actions */}
        <Card className="quick-actions-card-content">
          <h3 className="quick-actions-title">Quick Actions</h3>
          <div className="quick-actions-list">
            <button className="quick-action-button">
              <div className="quick-action-content">
                <Users className="quick-action-icon-blue" />
                <span className="quick-action-text">Manage Users</span>
              </div>
            </button>
            <button className="quick-action-button">
              <div className="quick-action-content">
                <BookOpen className="quick-action-icon-green" />
                <span className="quick-action-text">Manage Classes</span>
              </div>
            </button>
            <button className="quick-action-button">
              <div className="quick-action-content">
                <TrendingUp className="quick-action-icon-purple" />
                <span className="quick-action-text">View Reports</span>
              </div>
            </button>
          </div>
        </Card>

        {/* Recent Users */}
        <Card className="recent-users-card-content">
          <h3 className="recent-users-title">Recent Users</h3>
          <div className="recent-users-list">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="recent-user-item">
                <div className="recent-user-info">
                  <div className="recent-user-avatar-wrapper">
                    <div className="recent-user-avatar">
                      <Users className="recent-user-avatar-icon" />
                    </div>
                  </div>
                  <div className="recent-user-details">
                    <p className="recent-user-name">{user.firstName} {user.lastName}</p>
                    <p className="recent-user-email">{user.email}</p>
                  </div>
                </div>
                <Badge variant={user.role === 'Admin' ? 'danger' : user.role === 'Teacher' ? 'warning' : 'primary'}>
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