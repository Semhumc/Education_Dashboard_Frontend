// src/components/pages/admin/ClassManagementPage.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, Users, BookOpen } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { Modal } from '../../ui/Modal';
import { Table } from '../../ui/Table';
import { CreateClassForm } from '../../forms/CreateClassForm';
import { useNotification } from '../../../hooks/useNotification';
import { classService } from '../../../services/classService';
import { userService } from '../../../services/userService';
import type { Class } from '../../../types/auth.types';

export const ClassManagementPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();

  // Fetch classes and users
  const { data: classes = [], isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: classService.getAllClasses,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers,
  });

  // Delete class mutation
  const deleteClassMutation = useMutation({
    mutationFn: classService.deleteClass,
    onSuccess: () => {
      showSuccess('Class deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
    onError: () => {
      showError('Failed to delete class');
    },
  });

  // Filter classes based on search
  const filteredClasses = classes.filter(cls =>
    cls.class_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClass = (classId: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      deleteClassMutation.mutate(classId);
    }
  };

  const handleEditClass = (cls: Class) => {
    setSelectedClass(cls);
    setShowEditModal(true);
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = users.find(user => user.id === teacherId);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown Teacher';
  };

  const columns = [
    {
      key: 'class_name',
      header: 'Class Name',
      render: (cls: Class) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{cls.class_name}</div>
            <div className="text-sm text-gray-500">ID: {cls.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'teacher',
      header: 'Teacher',
      render: (cls: Class) => (
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-900">{getTeacherName(cls.teacher_id)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (cls: Class) => (
        <Badge variant="success">Active</Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (cls: Class) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => handleEditClass(cls)}
          />
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={() => handleDeleteClass(cls.id)}
            className="text-red-600 hover:text-red-700"
          />
        </div>
      ),
    },
  ];

  const stats = {
    total: classes.length,
    active: classes.length, // Assuming all classes are active
    teachers: new Set(classes.map(cls => cls.teacher_id)).size,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
          <p className="text-gray-600 mt-1">Manage classes and teacher assignments</p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowCreateModal(true)}
        >
          Add Class
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Classes</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-sm text-gray-600">Active Classes</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.teachers}</p>
            <p className="text-sm text-gray-600">Assigned Teachers</p>
          </div>
        </Card>
      </div>

      {/* Search Filter */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search classes..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredClasses.length} of {classes.length} classes
          </div>
        </div>
      </Card>

      {/* Classes Table */}
      <Card>
        <Table
          data={filteredClasses}
          columns={columns}
          loading={isLoading}
          emptyMessage="No classes found"
        />
      </Card>

      {/* Create Class Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Class"
        size="md"
      >
        <CreateClassForm
          onSuccess={() => {
            setShowCreateModal(false);
          }}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit Class Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Class"
        size="md"
      >
        {selectedClass && (
          <CreateClassForm
            onSuccess={() => {
              setShowEditModal(false);
              setSelectedClass(null);
            }}
            onCancel={() => setShowEditModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};