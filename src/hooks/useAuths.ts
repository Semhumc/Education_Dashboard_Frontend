// src/hooks/useAuth.ts
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import type { RegisterRequest } from '../types/auth.types';
import type { LoginRequest } from '../types/auth.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../types/auth.types';

export const useAuth = () => {
  const { token, user, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const decodedToken: any = jwtDecode(data.access_token);
      const user: User = {
        id: decodedToken.sub,
        username: decodedToken.preferred_username,
        email: decodedToken.email,
        firstName: decodedToken.given_name,
        lastName: decodedToken.family_name,
        phone: decodedToken.phone_number || '',
        role: decodedToken.realm_access?.roles?.[0] || 'student' // Assuming first role is the primary role
      };
      setAuth(data.access_token, data.refresh_token, user);
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