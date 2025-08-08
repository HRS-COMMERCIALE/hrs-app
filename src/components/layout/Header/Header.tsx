import React from 'react';
import { Button } from '../../ui';

interface HeaderProps {
  title?: string;
  showUserMenu?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = 'HRS App',
  showUserMenu = true 
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>
          
          {showUserMenu && (
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                Profile
              </Button>
              <Button variant="outline" size="sm">
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
