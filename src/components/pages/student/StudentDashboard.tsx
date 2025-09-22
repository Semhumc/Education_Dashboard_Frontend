// src/pages/student/StudentDashboard.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ClipboardList, Calendar, UserCheck, AlertTriangle, Clock } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { useAuthStore } from '../../../store/authStore';
import { homeworkService } from '../../../services/homeworkService';
import { scheduleService } from '../../../services/scheduleService';
import { attendanceService } from '../../../services/attendanceService';
import { format, isToday } from 'date-fns';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const studentId = user?.id || '';

  const { data: allHomeworks = [] } = useQuery({
    queryKey: ['homeworks'],
    queryFn: homeworkService.getAllHomeworks,
  });

  const { data: mySchedules = [] } = useQuery({
    queryKey: ['schedules'],
    queryFn: scheduleService.getAllSchedules,
  });

  const { data: myAttendance = [] } = useQuery({
    queryKey: ['student-attendance', studentId],
    queryFn: () => attendanceService.getAttendanceByStudent(studentId),
    enabled: !!studentId,
  });

  // Filter data for student
  const activeHomeworks = allHomeworks.filter(hw => new Date(hw.due_date) > new Date());
  const overdueHomeworks = allHomeworks.filter(hw => new Date(hw.due_date) <= new Date());
  const dueSoonHomeworks = allHomeworks.filter(hw => {
    const dueDate = new Date(hw.due_date);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays > 0 && diffDays <= 3;
  });

  const todaySchedules = mySchedules.filter(schedule => isToday(new Date(schedule.date)));

  const attendanceRate = myAttendance.length > 0 
    ? Math.round((myAttendance.filter(att => att.here).length / myAttendance.length) * 100)
    : 0;

  const stats = {
    activeHomeworks: activeHomeworks.length,
    overdueHomeworks: overdueHomeworks.length,
    todayClasses: todaySchedules.length,
    attendanceRate,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Hello, {user?.firstName}!</h1>
        <p className="text-green-100 mt-2">Stay on top of your assignments and schedule.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Homework</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeHomeworks}</p>
            </div>
            <ClipboardList className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.overdueHomeworks}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Classes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.todayClasses}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.attendanceRate}%</p>
            </div>
            <UserCheck className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Homework */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Homework</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            {dueSoonHomeworks.slice(0, 4).map((homework) => (
              <div key={homework.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{homework.title}</p>
                  <p className="text-sm text-gray-600">Due: {format(new Date(homework.due_date), 'MMM dd, yyyy')}</p>
                </div>
                <Badge variant="warning">Due Soon</Badge>
              </div>
            ))}
            {activeHomeworks.filter(hw => {
              const dueDate = new Date(hw.due_date);
              const now = new Date();
              const diffTime = dueDate.getTime() - now.getTime();
              const diffDays = diffTime / (1000 * 3600 * 24);
              return diffDays > 3;
            }).slice(0, 4 - dueSoonHomeworks.length).map((homework) => (
              <div key={homework.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{homework.title}</p>
                  <p className="text-sm text-gray-600">Due: {format(new Date(homework.due_date), 'MMM dd, yyyy')}</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            ))}
            {activeHomeworks.length === 0 && (
              <p className="text-center text-gray-500 py-4">No active homework</p>
            )}
          </div>
        </Card>

        {/* Today's Schedule */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Classes</h3>
            <Button variant="outline" size="sm">View Week</Button>
          </div>
          <div className="space-y-3">
            {todaySchedules.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{schedule.lesson_id}</p>
                    <p className="text-sm text-gray-600">Class ID: {schedule.class_id}</p>
                  </div>
                </div>
                <Badge variant="primary">{schedule.time}</Badge>
              </div>
            ))}
            {todaySchedules.length === 0 && (
              <p className="text-center text-gray-500 py-4">No classes scheduled for today</p>
            )}
          </div>
        </Card>
      </div>

      {/* Overdue Homework Alert */}
      {overdueHomeworks.length > 0 && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Overdue Homework</h3>
              <p className="text-red-700 mb-3">
                You have {overdueHomeworks.length} overdue assignment{overdueHomeworks.length > 1 ? 's' : ''}. 
                Contact your teacher to discuss submission options.
              </p>
              <div className="space-y-2">
                {overdueHomeworks.slice(0, 3).map((homework) => (
                  <div key={homework.id} className="text-sm text-red-800">
                    • {homework.title} (Due: {format(new Date(homework.due_date), 'MMM dd, yyyy')})
                  </div>
                ))}
                {overdueHomeworks.length > 3 && (
                  <div className="text-sm text-red-800">
                    • And {overdueHomeworks.length - 3} more...
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};