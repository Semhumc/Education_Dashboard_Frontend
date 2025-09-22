// src/components/ui/Button.tsx
import React, { ButtonHTMLAttributes } from 'react';
import './Button.css'; // Import the new CSS file

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ElementType;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  className,
  children,
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const loadingClass = loading ? 'opacity-70 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClass} ${variantClass} ${sizeClass} ${loadingClass} ${className || ''}`.trim()}
      disabled={loading}
      {...props}
    >
      {loading && (
        <span className="spinner" role="status" aria-hidden="true"></span>
      )}
      {Icon && !loading && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
};