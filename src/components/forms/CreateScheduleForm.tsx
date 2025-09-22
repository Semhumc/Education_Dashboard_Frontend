// src/components/forms/CreateScheduleForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { scheduleService } from '../../services/scheduleService';
import { classService } from '../../services/classService';
import { lessonService } from '../../services/lessonService';
import { userService } from '../../services/userService';
import { useAuthStore } from '../../store/authStore';
import { useNotification } from '../../hooks/useNotification';

const createScheduleSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  teacher_id: z.string().min(1, 'Teacher is required'),
  lesson_id: z.string().min(1, 'Lesson is required'),
  class_id: z.string().min(1, 'Class is required'),
});

type CreateScheduleFormData = z.infer<typeof createScheduleSchema>;

interface CreateScheduleFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateScheduleForm: React.FC<CreateScheduleFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();

  // Fetch necessary data
  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => userService.getTeachers(),
  });

  const { data: classes = [] } = useQuery({
    queryKey: ['classes'],
    queryFn: classService.getAllClasses,
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ['lessons'],
    queryFn: lessonService.getAllLessons,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateScheduleFormData>({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: {
      teacher_id: user?.role === 'teacher' ? user.id : '',
    },
  });

  // Watch form values for conflict checking
  const watchedValues = watch(['teacher_id', 'class_id', 'date', 'time']);

  const createScheduleMutation = useMutation({
    mutationFn: scheduleService.createSchedule,
    onSuccess: () => {
      showSuccess('Schedule created successfully');
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      reset();
      onSuccess?.();
    },
    onError: (error) => {
      showError('Failed to create schedule', error instanceof Error ? error.message : 'Please try again');
    },
  });

  // Check for conflicts
  const { data: conflicts = [] } = useQuery({
    queryKey: ['schedule-conflicts', ...watchedValues],
    queryFn: () => scheduleService.checkConflicts({
      teacher_id: watchedValues[0],
      class_id: watchedValues[1],
      date: watchedValues[2],
      time: watchedValues[3],
    }),
    enabled: watchedValues.every(val => !!val),
    staleTime: 0,
  });

  const onSubmit = async (data: CreateScheduleFormData) => {
    // Check for conflicts before submitting
    if (conflicts.length > 0) {
      showError('Schedule conflict detected', 'Please choose a different time or date');
      return;
    }

    await createScheduleMutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('date')}
          label="Date"
          type="date"
          error={errors.date?.message}
          required
          min={new Date().toISOString().split('T')[0]} // Prevent past dates
        />

        <Input
          {...register('time')}
          label="Time"
          type="time"
          error={errors.time?.message}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teacher <span className="text-red-500">*</span>
          </label>
          <select
            {...register('teacher_id')}
            className="input"
            disabled={user?.role === 'teacher'}
          >
            <option value="">Select a teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.firstName} {teacher.lastName}
              </option>
            ))}
          </select>
          {errors.teacher_id && (
            <p className="text-sm text-red-600 mt-1">{errors.teacher_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lesson <span className="text-red-500">*</span>
          </label>
          <select
            {...register('lesson_id')}
            className="input"
          >
            <option value="">Select a lesson</option>
            {lessons.map((lesson) => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.lesson_name}
              </option>
            ))}
          </select>
          {errors.lesson_id && (
            <p className="text-sm text-red-600 mt-1">{errors.lesson_id.message}</p>
          )}
        </div>
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
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.class_name}
            </option>
          ))}
        </select>
        {errors.class_id && (
          <p className="text-sm text-red-600 mt-1">{errors.class_id.message}</p>
        )}
      </div>

      {/* Conflict Warning */}
      {conflicts.length > 0 && (
        <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Schedule Conflict Detected</h3>
              <p className="text-sm text-yellow-700 mt-1">
                There are {conflicts.length} conflicting schedule(s) at this time. Please choose a different time.
              </p>
            </div>
          </div>
        </div>
      )}

      {createScheduleMutation.error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">
            {createScheduleMutation.error instanceof Error 
              ? createScheduleMutation.error.message 
              : 'Failed to create schedule. Please try again.'
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
          loading={createScheduleMutation.isPending}
          disabled={conflicts.length > 0}
          className="flex-1"
        >
          Create Schedule
        </Button>
      </div>
    </form>
  );
};