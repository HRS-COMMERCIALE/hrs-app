'use client';

import { useBusiness } from '@/store/businessProvider';
import BusinessSelector from '@/components/layout/BusinessSelector';

export default function DashboardPage() {
  const { selectedBusiness, selectedBusinessId } = useBusiness();

  // Loading state is handled by BusinessProvider
  if (!selectedBusiness || !selectedBusiness.business) {
    return null;
  }

  const business = selectedBusiness.business;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to {business.businessName} Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your {business.industry} business operations
          </p>
        </div>
        <BusinessSelector />
      </div>

      {/* Business Info Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Details</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Name:</span>
                <span className="ml-2 font-medium">{business.businessName}</span>
              </div>
              <div>
                <span className="text-gray-500">Industry:</span>
                <span className="ml-2 font-medium">{business.industry}</span>
              </div>
              <div>
                <span className="text-gray-500">Size:</span>
                <span className="ml-2 font-medium">{business.size}</span>
              </div>
              <div>
                <span className="text-gray-500">Currency:</span>
                <span className="ml-2 font-medium">{business.currency}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Role</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">Role:</span>
                <span className="ml-2 font-medium capitalize">{selectedBusiness.role}</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className={`ml-2 font-medium ${selectedBusiness.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                  {selectedBusiness.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Joined:</span>
                <span className="ml-2 font-medium">
                  {selectedBusiness.joinedAt ? new Date(selectedBusiness.joinedAt).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                View Business Settings
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                Manage Team
              </button>
              <button className="w-full text-left px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                View Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Business ID Debug Info (remove in production) */}
      <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
        <strong>Debug Info:</strong> Business ID: {selectedBusinessId} | 
        Association ID: {selectedBusiness.associationId}
      </div>
    </div>
  );
}