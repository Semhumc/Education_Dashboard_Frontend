// src/components/common/RoleBasedComponent.tsx
import React from 'react';
import { useAuthStore } from '../../store/authStore';

interface RoleBasedComponentProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleBasedComponent: React.FC<RoleBasedComponentProps> = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const { user } = useAuthStore();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};