// src/components/forms/CreateHomeworkForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { homeworkService } from '../../services/homeworkService';
import { classService } from '../../services/classService';
import { lessonService } from '../../services/lessonService';
import { useAuthStore } from '../../store/authStore';
import type { Homework } from '../../types/auth.types';

const createHomeworkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  content: z.string().optional(),
  lesson_id: z.string().min(1, 'Lesson is required'),
  class_id: z.string().min(1, 'Class is required'),
  due_date: z.string().min(1, 'Due date is required'),
});

type CreateHomeworkFormData = z.infer<typeof createHomeworkSchema>;

interface CreateHomeworkFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Homework; // Added for editing
}

export const CreateHomeworkForm: React.FC<CreateHomeworkFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
}) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Fetch classes and lessons
  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: classService.getAllClasses,
  });

  const { data: lessons } = useQuery({
    queryKey: ['lessons'],
    queryFn: lessonService.getAllLessons,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateHomeworkFormData>({
    resolver: zodResolver(createHomeworkSchema),
    defaultValues: initialData ? {
      ...initialData,
      due_date: new Date(initialData.due_date).toISOString().slice(0, 16), // Format for datetime-local
    } : undefined,
  });

  const homeworkMutation = useMutation({
    mutationFn: (data: CreateHomeworkFormData) => {
      const homeworkPayload = {
        ...data,
        teacher_id: user?.id || '',
        due_date: new Date(data.due_date).toISOString(),
        content: data.content || '',
      };
      if (initialData?.id) {
        return homeworkService.updateHomework(initialData.id, homeworkPayload);
      } else {
        return homeworkService.createHomework(homeworkPayload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homeworks'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-homeworks'] }); // Invalidate teacher-specific homeworks
      reset(initialData ? {
        ...initialData,
        due_date: new Date(initialData.due_date).toISOString().slice(0, 16),
      } : undefined);
      onSuccess?.();
    },
  });

  const onSubmit = async (data: CreateHomeworkFormData) => {
    await homeworkMutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          {...register('title')}
          label="Homework Title"
          type="text"
          placeholder="Enter homework title"
          error={errors.title?.message}
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          {...register('content')}
          className="input min-h-[100px] resize-y"
          placeholder="Enter homework description and instructions"
        />
        {errors.content && (
          <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="lesson_id" className="block text-sm font-medium text-gray-700 mb-1">
            Lesson <span className="text-red-500">*</span>
          </label>
          <select
            {...register('lesson_id')}
            className="input"
            defaultValue=""
            required
          >
            <option value="" disabled>Select a lesson</option>
            {lessons?.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.lesson_name}
              </option>
            ))}
          </select>
          {errors.lesson_id && (
            <p className="text-sm text-red-600 mt-1">{errors.lesson_id.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="class_id" className="block text-sm font-medium text-gray-700 mb-1">
            Class <span className="text-red-500">*</span>
          </label>
          <select
            {...register('class_id')}
            className="input"
            defaultValue=""
            required
          >
            <option value="" disabled>Select a class</option>
            {classes?.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.class_name}
              </option>
            ))}
          </select>
          {errors.class_id && (
            <p className="text-sm text-red-600 mt-1">{errors.class_id.message}</p>
          )}
        </div>
      </div>

      <div>
        <Input
          {...register('due_date')}
          label="Due Date"
          type="datetime-local"
          error={errors.due_date?.message}
          required
        />
      </div>

      {homeworkMutation.error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">
            {homeworkMutation.error instanceof Error 
              ? homeworkMutation.error.message 
              : 'Failed to create homework. Please try again.'
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
          loading={homeworkMutation.isPending}
          className="flex-1"
        >
          {initialData ? 'Save Changes' : 'Create Homework'}
        </Button>
      </div>
    </form>
  );
};