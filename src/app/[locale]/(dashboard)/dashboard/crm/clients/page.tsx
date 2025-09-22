import React from 'react';
import Clients from '@/components/pages/dashboard/crm/client/Clients';

export default function Page() {
  return (
    <div className="px-4 py-6 md:px-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Clients</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your client directory and related details</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="px-3 py-1.5 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">CRM</span>
            <span className="px-3 py-1.5 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200">Management</span>
          </div>
        </div>
      </div>

      <Clients />
    </div>
  );
}


