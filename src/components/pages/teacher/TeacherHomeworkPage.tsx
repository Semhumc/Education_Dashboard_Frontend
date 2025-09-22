// src/components/pages/teacher/TeacherHomeworkPage.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Calendar, Clock, AlertCircle, ClipboardList } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Modal } from '../../ui/Modal';
import { CreateHomeworkForm } from '../../forms/CreateHomeworkForm';
import { homeworkService } from '../../../services/homeworkService';
import { useAuthStore } from '../../../store/authStore';
import { format, isAfter } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Import useMutation and useQueryClient
import type { Homework } from '../../../types/auth.types'; // Import Homework type

export const TeacherHomeworkPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // New state for edit modal
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null); // New state for selected homework
  const { user } = useAuthStore();
  const teacherId = user?.id || '';
  const queryClient = useQueryClient(); // Initialize useQueryClient

  const { data: myHomeworks = [], isLoading } = useQuery({
    queryKey: ['teacher-homeworks', teacherId],
    queryFn: () => homeworkService.getHomeworksByTeacher(teacherId),
    enabled: !!teacherId,
  });

  const activeHomeworks = myHomeworks.filter(hw => isAfter(new Date(hw.due_date), new Date()));
  const overdueHomeworks = myHomeworks.filter(hw => !isAfter(new Date(hw.due_date), new Date()));

  // Delete homework mutation
  const deleteHomeworkMutation = useMutation({
    mutationFn: homeworkService.deleteHomework,
    onSuccess: () => {
      // showSuccess('Homework deleted successfully'); // Assuming useNotification is available
      queryClient.invalidateQueries({ queryKey: ['teacher-homeworks'] });
      queryClient.invalidateQueries({ queryKey: ['homeworks'] });
    },
    onError: (error) => {
      // showError(`Failed to delete homework: ${error.message}`); // Assuming useNotification is available
      console.error("Failed to delete homework", error);
    },
  });

  const handleEditHomework = (homework: Homework) => {
    setSelectedHomework(homework);
    setShowEditModal(true);
  };

  const handleDeleteHomework = (homeworkId: string) => {
    if (window.confirm('Are you sure you want to delete this homework?')) {
      deleteHomeworkMutation.mutate(homeworkId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homework Management</h1>
          <p className="text-gray-600 mt-1">Create and manage assignments</p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowCreateModal(true)}
        >
          Create Homework
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{myHomeworks.length}</p>
            <p className="text-sm text-gray-600">Total Assignments</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{activeHomeworks.length}</p>
            <p className="text-sm text-gray-600">Active</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{overdueHomeworks.length}</p>
            <p className="text-sm text-gray-600">Overdue</p>
          </div>
        </Card>
      </div>

      {/* Homework List */}
      <div className="space-y-4">
        {myHomeworks.map((homework) => (
          <Card key={homework.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">{homework.title}</h3>
                  <Badge 
                    variant={isAfter(new Date(homework.due_date), new Date()) ? 'success' : 'danger'}
                  >
                    {isAfter(new Date(homework.due_date), new Date()) ? 'Active' : 'Overdue'}
                  </Badge>
                </div>
                
                <p className="text-gray-600 mt-2">{homework.content}</p>
                
                <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {format(new Date(homework.due_date), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(homework.due_date), 'HH:mm')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditHomework(homework)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600"
                  onClick={() => handleDeleteHomework(homework.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {myHomeworks.length === 0 && !isLoading && (
        <Card className="p-8 text-center">
          <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No Homework Created</h3>
          <p className="mt-2 text-sm text-gray-500">
            Create your first homework assignment to get started.
          </p>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowCreateModal(true)}
            className="mt-4"
          >
            Create Homework
          </Button>
        </Card>
      )}

      {/* Create Homework Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Homework"
        size="lg"
      >
        <CreateHomeworkForm
          onSuccess={() => setShowCreateModal(false)}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Homework Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Homework"
        size="lg"
      >
        {selectedHomework && (
          <CreateHomeworkForm
            initialData={selectedHomework}
            onSuccess={() => {
              setShowEditModal(false);
              setSelectedHomework(null);
            }}
            onCancel={() => setShowEditModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};