// src/hooks/useAuth.ts
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import type { RegisterRequest } from '../types/auth.types';
import type { LoginRequest } from '../types/auth.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAuth = () => {
  const { token, user, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // JWT token'ı decode ederek user bilgilerini al (real implementation'da jwt-decode kullanın)
      // Bu örnek için static user object kullanıyorum
      const mockUser = {
        id: '1',
        username: 'user',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '123456789',
        role: 'teacher'
      };
      setAuth(data.access_token, data.refresh_token, mockUser);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout({
      access_token: token!,
      refresh_token: useAuthStore.getState().refreshToken!,
    }),
    onSettled: () => {
      storeLogout();
      queryClient.clear();
    },
  });

  const login = (credentials: LoginRequest) => {
    return loginMutation.mutateAsync(credentials);
  };

  const register = (userData: RegisterRequest) => {
    return registerMutation.mutateAsync(userData);
  };

  const logout = () => {
    if (token) {
      logoutMutation.mutate();
    } else {
      storeLogout();
    }
  };

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
  };
};