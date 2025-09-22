// src/components/forms/AttendanceForm.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { UserCheck, UserX, Clock } from 'lucide-react';
import { attendanceService } from '../../services/attendanceService';
import { userService } from '../../services/userService';
import { scheduleService } from '../../services/scheduleService';
import { useNotification } from '../../hooks/useNotification';

interface AttendanceFormProps {
  scheduleId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({ 
  scheduleId, 
  onSuccess, 
  onCancel 
}) => {
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();
  const [attendanceData, setAttendanceData] = useState<Record<string, boolean>>({});

  // Get schedule details
  const { data: schedule } = useQuery({
    queryKey: ['schedule', scheduleId],
    queryFn: () => scheduleService.getScheduleById(scheduleId),
    enabled: !!scheduleId,
  });

  // Get students (you might need to get students from a class)
  const { data: students = [] } = useQuery({
    queryKey: ['students'],
    queryFn: () => userService.getStudents(),
  });

  // Get existing attendance for this schedule
  const { data: existingAttendance = [] } = useQuery({
    queryKey: ['attendance', 'schedule', scheduleId],
    queryFn: () => attendanceService.getAttendanceBySchedule(scheduleId),
    enabled: !!scheduleId,
  });

  // Initialize attendance data
  React.useEffect(() => {
    const initialData: Record<string, boolean> = {};
    students.forEach(student => {
      const existing = existingAttendance.find(att => att.student_id === student.id);
      initialData[student.id] = existing ? existing.here : false;
    });
    setAttendanceData(initialData);
  }, [students, existingAttendance]);

  const markAttendanceMutation = useMutation({
    mutationFn: async () => {
      const promises = Object.entries(attendanceData).map(([studentId, isPresent]) =>
        attendanceService.markAttendance({
          student_id: studentId,
          schedule_id: scheduleId,
          is_present: isPresent,
        })
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      showSuccess('Attendance marked successfully');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      onSuccess?.();
    },
    onError: () => {
      showError('Failed to mark attendance');
    },
  });

  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: isPresent,
    }));
  };

  const handleSubmit = () => {
    markAttendanceMutation.mutate();
  };

  const presentCount = Object.values(attendanceData).filter(Boolean).length;
  const totalCount = students.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Mark Attendance</h3>
            <p className="text-sm text-gray-600">
              Schedule: {schedule?.date} at {schedule?.time}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {presentCount}/{totalCount} Present
            </span>
          </div>
        </div>
      </Card>

      {/* Student List */}
      <div className="space-y-2">
        {students.map((student) => (
          <Card key={student.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {student.firstName[0]}{student.lastName[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{student.username}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={attendanceData[student.id] ? 'success' : 'gray'}
                  className="mr-2"
                >
                  {attendanceData[student.id] ? 'Present' : 'Absent'}
                </Badge>
                
                <Button
                  variant={attendanceData[student.id] ? 'success' : 'outline'}
                  size="sm"
                  icon={UserCheck}
                  onClick={() => handleAttendanceChange(student.id, true)}
                >
                  Present
                </Button>
                
                <Button
                  variant={!attendanceData[student.id] ? 'danger' : 'outline'}
                  size="sm"
                  icon={UserX}
                  onClick={() => handleAttendanceChange(student.id, false)}
                >
                  Absent
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          variant="primary"
          loading={markAttendanceMutation.isPending}
          onClick={handleSubmit}
        >
          Save Attendance
        </Button>
      </div>
    </div>
  );
};