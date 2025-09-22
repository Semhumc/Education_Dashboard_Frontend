// src/components/forms/CreateClassForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { classService } from '../../services/classService';
import { authService } from '../../services/authService';

const createClassSchema = z.object({
  class_name: z.string().min(1, 'Class name is required').max(255, 'Class name is too long'),
  teacher_id: z.string().min(1, 'Teacher is required'),
});

type CreateClassFormData = z.infer<typeof createClassSchema>;

interface CreateClassFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateClassForm: React.FC<CreateClassFormProps> = ({ onSuccess, onCancel }) => {
  const queryClient = useQueryClient();

  // Fetch teachers
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: authService.getAllUsers,
  });

  const teachers = users?.filter(user => user.role === 'teacher') || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateClassFormData>({
    resolver: zodResolver(createClassSchema),
  });

  const createClassMutation = useMutation({
    mutationFn: classService.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      reset();
      onSuccess?.();
    },
  });

  const onSubmit = async (data: CreateClassFormData) => {
    await createClassMutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          {...register('class_name')}
          label="Class Name"
          type="text"
          placeholder="Enter class name (e.g., Math 101)"
          error={errors.class_name?.message}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teacher <span className="text-red-500">*</span>
        </label>
        <select
          {...register('teacher_id')}
          className="input"
        >
          <option value="">Select a teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.firstName} {teacher.lastName} ({teacher.username})
            </option>
          ))}
        </select>
        {errors.teacher_id && (
          <p className="text-sm text-red-600 mt-1">{errors.teacher_id.message}</p>
        )}
      </div>

      {createClassMutation.error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">
            {createClassMutation.error instanceof Error 
              ? createClassMutation.error.message 
              : 'Failed to create class. Please try again.'
            }
          </p>
        </div>
      )}

      <div className="flex space-x-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          loading={createClassMutation.isPending}
          className="flex-1"
        >
          Create Class
        </Button>
      </div>
    </form>
  );
};