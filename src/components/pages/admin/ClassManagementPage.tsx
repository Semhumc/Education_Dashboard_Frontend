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
import './ClassManagementPage.css'; // Import the new CSS file

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
        <div className="class-name-column">
          <div className="class-icon-wrapper">
            <BookOpen className="class-icon" />
          </div>
          <div>
            <div className="class-details-name">{cls.class_name}</div>
            <div className="class-details-id">ID: {cls.id}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'teacher',
      header: 'Teacher',
      render: (cls: Class) => (
        <div className="teacher-column">
          <Users className="teacher-icon" />
          <span className="teacher-name">{getTeacherName(cls.teacher_id)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: () => (
        <Badge variant="success">Active</Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (cls: Class) => (
        <div className="actions-column">
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
            className="action-button-danger"
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
    <div className="class-management-container">
      {/* Page Header */}
      <div className="class-management-header">
        <div>
          <h1 className="class-management-title">Class Management</h1>
          <p className="class-management-subtitle">Manage classes and teacher assignments</p>
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
      <div className="stats-cards-grid">
        <Card className="stat-card-content-center">
          <div className="text-center">
            <p className="stat-value-blue">{stats.total}</p>
            <p className="stat-label">Total Classes</p>
          </div>
        </Card>
        <Card className="stat-card-content-center">
          <div className="text-center">
            <p className="stat-value-green">{stats.active}</p>
            <p className="stat-label">Active Classes</p>
          </div>
        </Card>
        <Card className="stat-card-content-center">
          <div className="text-center">
            <p className="stat-value-yellow">{stats.teachers}</p>
            <p className="stat-label">Assigned Teachers</p>
          </div>
        </Card>
      </div>

      {/* Search Filter */}
      <Card className="search-filter-card-content">
        <div className="search-filter-wrapper">
          <div className="search-input-group">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search classes..."
              className="input search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="search-results-info">
            Showing {filteredClasses.length} of {classes.length} classes
          </div>
        </div>
      </Card>

      {/* Classes Table */}
      <Card className="class-table-card-content">
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