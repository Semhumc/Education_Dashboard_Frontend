// src/components/ui/Input.tsx
import React, { type InputHTMLAttributes } from 'react';
import './Input.css'; // Import the new CSS file

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ElementType;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    icon: Icon,
    error,
    className,
    id,
    ...props
  }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '') : undefined);
    const hasIcon = !!Icon;

    return (
      <div className="input-container">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {props.required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="input-wrapper">
          {Icon && (
            <Icon className="input-icon" />
          )}
          <input
            id={inputId}
            ref={ref}
            className={`input ${hasIcon ? 'input-icon-left' : ''} ${error ? 'input-error' : ''} ${className || ''}`.trim()}
            {...props}
          />
        </div>
        {error && (
          <p className="error-message">{error}</p>
        )}
      </div>
    );
  }
);