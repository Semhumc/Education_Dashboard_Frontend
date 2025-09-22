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
}

export const CreateHomeworkForm: React.FC<CreateHomeworkFormProps> = ({ onSuccess, onCancel }) => {
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
  });

  const createHomeworkMutation = useMutation({
    mutationFn: homeworkService.createHomework,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homeworks'] });
      reset();
      onSuccess?.();
    },
  });

  const onSubmit = async (data: CreateHomeworkFormData) => {
    const homeworkData = {
      ...data,
      teacher_id: user?.id || '',
      due_date: new Date(data.due_date).toISOString(),
    };
    await createHomeworkMutation.mutateAsync(homeworkData);
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lesson <span className="text-red-500">*</span>
          </label>
          <select
            {...register('lesson_id')}
            className="input"
          >
            <option value="">Select a lesson</option>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class <span className="text-red-500">*</span>
          </label>
          <select
            {...register('class_id')}
            className="input"
          >
            <option value="">Select a class</option>
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

      {createHomeworkMutation.error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">
            {createHomeworkMutation.error instanceof Error 
              ? createHomeworkMutation.error.message 
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
          loading={createHomeworkMutation.isPending}
          className="flex-1"
        >
          Create Homework
        </Button>
      </div>
    </form>
  );
};