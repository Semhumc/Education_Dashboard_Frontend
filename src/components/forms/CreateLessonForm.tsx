// src/components/forms/CreateLessonForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { lessonService } from '../../services/lessonService';

const createLessonSchema = z.object({
  lesson_name: z.string().min(1, 'Lesson name is required').max(255, 'Lesson name is too long'),
});

type CreateLessonFormData = z.infer<typeof createLessonSchema>;

interface CreateLessonFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateLessonForm: React.FC<CreateLessonFormProps> = ({ onSuccess, onCancel }) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateLessonFormData>({
    resolver: zodResolver(createLessonSchema),
  });

  const createLessonMutation = useMutation({
    mutationFn: lessonService.createLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      reset();
      onSuccess?.();
    },
  });

  const onSubmit = async (data: CreateLessonFormData) => {
    await createLessonMutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          {...register('lesson_name')}
          label="Lesson Name"
          type="text"
          placeholder="Enter lesson name (e.g., Mathematics, English Literature)"
          error={errors.lesson_name?.message}
          required
        />
      </div>

      {createLessonMutation.error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">
            {createLessonMutation.error instanceof Error 
              ? createLessonMutation.error.message 
              : 'Failed to create lesson. Please try again.'
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
          loading={createLessonMutation.isPending}
          className="flex-1"
        >
          Create Lesson
        </Button>
      </div>
    </form>
  );
};