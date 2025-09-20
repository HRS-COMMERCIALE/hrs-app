'use client';

import React, { useState } from 'react';
import { useBusiness } from '@/store/businessProvider';
import { Building2, ChevronDown, Check } from 'lucide-react';

export default function BusinessSelector() {
  const { selectedBusiness, userBusinesses, switchBusiness } = useBusiness();
  const [isOpen, setIsOpen] = useState(false);

  if (!selectedBusiness) return null;

  const currentBusiness = selectedBusiness.business;
  if (!currentBusiness) return null;

  const handleBusinessSwitch = (businessId: number) => {
    switchBusiness(businessId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#3c959d] to-[#ef7335] flex items-center justify-center">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <div className="text-left">
          <div className="font-semibold text-gray-900 text-sm">
            {currentBusiness.businessName}
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {selectedBusiness.role} • {currentBusiness.industry}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {userBusinesses.map((businessAssociation) => {
            const business = businessAssociation.business;
            if (!business) return null;

            const isSelected = business.id === currentBusiness.id;
            
            return (
              <button
                key={business.id}
                onClick={() => handleBusinessSwitch(business.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#3c959d] to-[#ef7335] flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm truncate">
                    {business.businessName}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {businessAssociation.role} • {business.industry}
                  </div>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
