// src/pages/teacher/TeacherDashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, ClipboardList, Calendar, UserCheck, Clock, AlertCircle } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { classService } from '../../../services/classService';
import { useAuthStore } from '../../../store/authStore';
import { homeworkService } from '../../../services/homeworkService';
import { scheduleService } from '../../../services/scheduleService';
import { format } from 'date-fns';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const teacherId = user?.id || '';

  const { data: myClasses = [] } = useQuery({
    queryKey: ['teacher-classes', teacherId],
    queryFn: () => classService.getClassesByTeacher(teacherId),
    enabled: !!teacherId,
  });

  const { data: myHomeworks = [] } = useQuery({
    queryKey: ['teacher-homeworks', teacherId],
    queryFn: () => homeworkService.getHomeworksByTeacher(teacherId),
    enabled: !!teacherId,
  });



  const { data: upcomingSchedules = [] } = useQuery({
    queryKey: ['upcoming-schedules', teacherId],
    queryFn: () => scheduleService.getUpcomingSchedules(teacherId, 7),
    enabled: !!teacherId,
  });

  const { data: dueSoonHomeworks = [] } = useQuery({
    queryKey: ['due-soon-homeworks'],
    queryFn: () => homeworkService.getHomeworksDueSoon(48),
  });

  const stats = {
    totalClasses: myClasses.length,
    totalHomeworks: myHomeworks.length,
    upcomingClasses: upcomingSchedules.length,
    dueSoonHomeworks: dueSoonHomeworks.length,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}!</h1>
        <p className="text-blue-100 mt-2">Here's what's happening with your classes today.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Classes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalClasses}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Homework</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalHomeworks}</p>
            </div>
            <ClipboardList className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Classes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.upcomingClasses}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Due Soon</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.dueSoonHomeworks}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {upcomingSchedules.slice(0, 4).map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{schedule.lesson_id}</p>
                    <p className="text-sm text-gray-500">{format(new Date(schedule.date), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                <Badge variant="primary">{schedule.time}</Badge>
              </div>
            ))}
            {upcomingSchedules.length === 0 && (
              <p className="text-center text-gray-500 py-4">No classes scheduled for today</p>
            )}
          </div>
        </Card>

        {/* Recent Homework */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Homework</h3>
            <Button variant="outline" size="sm">Create New</Button>
          </div>
          <div className="space-y-3">
            {myHomeworks.slice(0, 4).map((homework) => (
              <div key={homework.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{homework.title}</p>
                  <p className="text-sm text-gray-500">Due: {format(new Date(homework.due_date), 'MMM dd, yyyy')}</p>
                </div>
                <Badge 
                  variant={new Date(homework.due_date) < new Date() ? 'danger' : 'success'}
                >
                  {new Date(homework.due_date) < new Date() ? 'Overdue' : 'Active'}
                </Badge>
              </div>
            ))}
            {myHomeworks.length === 0 && (
              <p className="text-center text-gray-500 py-4">No homework assigned yet</p>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button variant="primary" className="flex items-center justify-center space-x-2">
            <ClipboardList className="h-4 w-4" />
            <span>Create Homework</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center space-x-2">
            <UserCheck className="h-4 w-4" />
            <span>Take Attendance</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Schedule Class</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Manage Lessons</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};
