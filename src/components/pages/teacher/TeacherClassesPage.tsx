// src/components/pages/teacher/TeacherClassesPage.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Users, Calendar, ClipboardList } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { classService } from '../../../services/classService';
import { useAuthStore } from '../../../store/authStore';
import type { Class } from '../../../types/auth.types';
import { homeworkService } from '../../../services/homeworkService';
import { scheduleService } from '../../../services/scheduleService';
import { userService } from '../../../services/userService';
import { Modal } from '../../ui/Modal';
import { format } from 'date-fns';
import { Table } from '../../ui/Table';

export const TeacherClassesPage: React.FC = () => {
  const { user } = useAuthStore();
  const teacherId = user?.id || '';
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showHomeworkModal, setShowHomeworkModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedClassForModal, setSelectedClassForModal] = useState<Class | null>(null);

  const { data: myClasses = [], isLoading } = useQuery({
    queryKey: ['teacher-classes', teacherId],
    queryFn: () => classService.getClassesByTeacher(teacherId),
    enabled: !!teacherId,
  });

  const handleViewStudents = (cls: Class) => {
    setSelectedClassForModal(cls);
    setShowStudentsModal(true);
  };

  const handleViewHomework = (cls: Class) => {
    setSelectedClassForModal(cls);
    setShowHomeworkModal(true);
  };

  const handleViewSchedule = (cls: Class) => {
    setSelectedClassForModal(cls);
    setShowScheduleModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
        <p className="text-gray-600 mt-1">Manage your assigned classes</p>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myClasses.map((cls) => (
          <Card key={cls.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{cls.class_name}</h3>
                  <p className="text-sm text-gray-500">Class ID: {cls.id}</p>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <ClassStats classId={cls.id} />

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Button variant="primary" size="sm" icon={Users} onClick={() => handleViewStudents(cls)}>
                Students
              </Button>
              <Button variant="outline" size="sm" icon={ClipboardList} onClick={() => handleViewHomework(cls)}>
                Homework
              </Button>
              <Button variant="secondary" size="sm" icon={Calendar} onClick={() => handleViewSchedule(cls)}>
                Schedule
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {myClasses.length === 0 && !isLoading && (
        <Card className="p-8 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Classes Assigned</h3>
          <p className="mt-2 text-sm text-gray-500">
            You haven't been assigned to any classes yet. Contact your administrator.
          </p>
        </Card>
      )}

      {/* Students Modal */}
      <Modal
        isOpen={showStudentsModal}
        onClose={() => setShowStudentsModal(false)}
        title={selectedClassForModal ? `Students in ${selectedClassForModal.class_name}` : 'Class Students'}
        size="lg"
      >
        {selectedClassForModal && <ClassStudentsModalContent classId={selectedClassForModal.id} />}
      </Modal>

      {/* Homework Modal */}
      <Modal
        isOpen={showHomeworkModal}
        onClose={() => setShowHomeworkModal(false)}
        title={selectedClassForModal ? `Homework for ${selectedClassForModal.class_name}` : 'Class Homework'}
        size="lg"
      >
        {selectedClassForModal && <ClassHomeworkModalContent classId={selectedClassForModal.id} />}
      </Modal>

      {/* Schedule Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title={selectedClassForModal ? `Schedule for ${selectedClassForModal.class_name}` : 'Class Schedule'}
        size="lg"
      >
        {selectedClassForModal && <ClassScheduleModalContent classId={selectedClassForModal.id} />}
      </Modal>
    </div>
  );
};

interface ClassStatsProps {
  classId: string;
}

const ClassStats: React.FC<ClassStatsProps> = ({ classId }) => {
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['classStudents', classId],
    queryFn: () => userService.getStudentsByClass(classId),
  });

  const { data: homeworks = [], isLoading: homeworksLoading } = useQuery({
    queryKey: ['classHomeworks', classId],
    queryFn: () => homeworkService.getHomeworksByClass(classId),
  });

  const { data: schedules = [], isLoading: schedulesLoading } = useQuery({
    queryKey: ['classSchedules', classId],
    queryFn: () => scheduleService.getSchedulesByClass(classId),
  });

  const nextClass = schedules.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Students</span>
        <span className="font-medium">
          {studentsLoading ? 'Loading...' : students.length}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Assignments</span>
        <span className="font-medium">
          {homeworksLoading ? 'Loading...' : homeworks.length}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500">Next Class</span>
        <span className="font-medium">
          {schedulesLoading 
            ? 'Loading...' 
            : nextClass 
            ? `${format(new Date(nextClass.date), 'MMM dd, yyyy')} ${format(new Date(`2000-01-01T${nextClass.time}`), 'HH:mm')}` 
            : 'N/A'
          }
        </span>
      </div>
    </div>
  );
};

interface ClassModalContentProps {
  classId: string;
}

const ClassStudentsModalContent: React.FC<ClassModalContentProps> = ({ classId }) => {
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['modalStudents', classId],
    queryFn: () => userService.getStudentsByClass(classId),
  });

  const columns = [
    { key: 'firstName', header: 'First Name' },
    { key: 'lastName', header: 'Last Name' },
    { key: 'email', header: 'Email' },
  ];

  return (
    <div className="mt-4">
      {isLoading ? (
        <div>Loading students...</div>
      ) : students.length === 0 ? (
        <div>No students assigned to this class.</div>
      ) : (
        <Table data={students} columns={columns} />
      )}
    </div>
  );
};

const ClassHomeworkModalContent: React.FC<ClassModalContentProps> = ({ classId }) => {
  const { data: homeworks = [], isLoading } = useQuery({
    queryKey: ['modalHomeworks', classId],
    queryFn: () => homeworkService.getHomeworksByClass(classId),
  });

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'due_date', header: 'Due Date', render: (hw: { due_date: string }) => format(new Date(hw.due_date), 'MMM dd, yyyy HH:mm') },
  ];

  return (
    <div className="mt-4">
      {isLoading ? (
        <div>Loading homework...</div>
      ) : homeworks.length === 0 ? (
        <div>No homework assigned to this class.</div>
      ) : (
        <Table data={homeworks} columns={columns} />
      )}
    </div>
  );
};

const ClassScheduleModalContent: React.FC<ClassModalContentProps> = ({ classId }) => {
  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ['modalSchedules', classId],
    queryFn: () => scheduleService.getSchedulesByClass(classId),
  });

  const columns = [
    { key: 'date', header: 'Date', render: (sch: { date: string }) => format(new Date(sch.date), 'MMM dd, yyyy') },
    { key: 'time', header: 'Time' },
    { key: 'lesson_name', header: 'Lesson' }, // Assuming schedule object includes lesson_name
  ];

  return (
    <div className="mt-4">
      {isLoading ? (
        <div>Loading schedule...</div>
      ) : schedules.length === 0 ? (
        <div>No schedule for this class.</div>
      ) : (
        <Table data={schedules} columns={columns} />
      )}
    </div>
  );
};

