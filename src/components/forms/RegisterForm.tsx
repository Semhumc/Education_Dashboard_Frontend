// src/components/forms/RegisterForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Lock, UserCheck } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuths';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  role: z.enum(['Admin', 'Teacher', 'Student']),
  familyPhone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { register: registerUser, isLoading } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = data;
      void confirmPassword;
      await registerUser(registerData);
      onSuccess?.();
    } catch {
      // Error is handled by the useAuth hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('firstName')}
          label="First Name"
          type="text"
          icon={User}
          placeholder="Enter your first name"
          error={errors.firstName?.message}
          required
        />

        <Input
          {...register('lastName')}
          label="Last Name"
          type="text"
          icon={User}
          placeholder="Enter your last name"
          error={errors.lastName?.message}
          required
        />
      </div>

      <Input
        {...register('username')}
        label="Username"
        type="text"
        icon={UserCheck}
        placeholder="Enter your username"
        error={errors.username?.message}
        required
      />

      <Input
        {...register('email')}
        label="Email"
        type="email"
        icon={Mail}
        placeholder="Enter your email"
        error={errors.email?.message}
        required
      />

      <Input
        {...register('phone')}
        label="Phone"
        type="tel"
        icon={Phone}
        placeholder="Enter your phone number"
        error={errors.phone?.message}
        required
      />

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Role <span className="text-red-500">*</span>
        </label>
        <select
          {...register('role')}
          id="role"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Select your role</option>
          <option value="Student">Student</option>
          <option value="Teacher">Teacher</option>
          <option value="Admin">Administrator</option>
        </select>
        {errors.role && (
          <p className="error-message">{errors.role.message}</p>
        )}
      </div>

      {selectedRole === 'Student' && (
        <Input
          {...register('familyPhone')}
          label="Family Phone (Optional)"
          type="tel"
          icon={Phone}
          placeholder="Enter family contact number"
          error={errors.familyPhone?.message}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('password')}
          label="Password"
          type="password"
          icon={Lock}
          placeholder="Enter your password"
          error={errors.password?.message}
          required
        />

        <Input
          {...register('confirmPassword')}
          label="Confirm Password"
          type="password"
          icon={Lock}
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={isLoading}
        className="w-full"
      >
        Create Account
      </Button>
    </form>
  );
};