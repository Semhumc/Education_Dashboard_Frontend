import React from 'react';
import { Button } from '../ui/Button';

interface RoleSelectorProps {
  onSelectRole: (role: 'Admin' | 'Teacher' | 'Student') => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  return (
    <div className="role-selector-container">
      <h2>Select Your Role to Login</h2>
      <div className="role-buttons">
        <Button variant="primary" onClick={() => onSelectRole('Admin')}>Admin Login</Button>
        <Button variant="secondary" onClick={() => onSelectRole('Teacher')}>Teacher Login</Button>
        <Button variant="outline" onClick={() => onSelectRole('Student')}>Student Login</Button>
      </div>
    </div>
  );
};
