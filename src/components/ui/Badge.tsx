// src/components/ui/Badge.tsx
import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClass = 'badge';
  const variantClass = `badge-${variant}`;
  const sizeClass = `badge-${size}`;

  return (
    <span
      className={`${baseClass} ${variantClass} ${sizeClass} ${className || ''}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
};

