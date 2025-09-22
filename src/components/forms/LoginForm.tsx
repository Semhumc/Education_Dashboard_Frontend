import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuths';
import './LoginForm.css'; // Import the new CSS file

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch {
      // Error is handled by the useAuth hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
      <div className="login-form-group">
        <Input
          {...register('username')}
          label="Username"
          type="text"
          icon={User}
          placeholder="Enter your username"
          error={errors.username?.message}
          required
        />
      </div>

      <div className="login-form-group">
        <Input
          {...register('password')}
          label="Password"
          type="password"
          icon={Lock}
          placeholder="Enter your password"
          error={errors.password?.message}
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={isLoading}
        className="w-full"
      >
        Sign In
      </Button>
    </form>
  );
};