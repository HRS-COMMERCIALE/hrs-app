import React from 'react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen = true,
  onClose 
}) => {
  return (
    <aside className={`bg-gray-50 border-r border-gray-200 w-64 min-h-screen ${isOpen ? 'block' : 'hidden'}`}>
      <div className="p-4">
        <nav className="space-y-2">
          <a href="/dashboard" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            Dashboard
          </a>
          <a href="/users" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            Users
          </a>
          <a href="/licenses" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            Licenses
          </a>
          <a href="/reports" className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
            Reports
          </a>
        </nav>
      </div>
    </aside>
  );
};
