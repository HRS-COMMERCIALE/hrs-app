'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

export default function CompanyInformation() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    businessName: '',
    taxId: '',
    cnssCode: '',
    website: '',
    currency: '',
    size: '',
    industry: '',
  });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch('/api/dashboard/settings/CompanyInformation/getInformation', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Accept': 'application/json' },
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error || `Request failed (${res.status})`);
        }
        const body = await res.json();
        const data = body?.data || {};
        if (!isMounted) return;
        setForm({
          businessName: data.businessName ?? '',
          taxId: data.taxId ?? '',
          cnssCode: data.cnssCode ?? '',
          website: data.website ?? '',
          currency: data.currency ?? '',
          size: data.size ?? '',
          industry: data.industry ?? '',
        });
        setError(null);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || 'Failed to load company information');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const onChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  return (
    <div className="max-w-4xl">
      {loading && (
        <div className="mb-4 text-sm text-gray-500 flex items-center gap-2">
          <Icon icon="solar:refresh-bold-duotone" className="animate-spin" width={16} height={16} />
          Loading company information...
        </div>
      )}
      {error && (
        <div className="mb-4 text-sm text-red-600 flex items-center gap-2">
          <Icon icon="solar:danger-triangle-bold-duotone" width={16} height={16} />
          {error}
        </div>
      )}

      <div className="space-y-8">
        {/* Business Details Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 flex items-center justify-center">
              <Icon icon="solar:buildings-2-bold-duotone" className="text-[#3c959d]" width={16} height={16} />
            </span>
            <h3 className="text-lg font-semibold text-gray-900">Business Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 focus:bg-white transition-all" 
                placeholder="Enter your company name" 
                value={form.businessName}
                onChange={onChange('businessName')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 focus:bg-white transition-all" 
                placeholder="TN-123456" 
                value={form.taxId}
                onChange={onChange('taxId')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 focus:bg-white transition-all" 
                placeholder="Enter tax identification number" 
                value={form.taxId}
                onChange={onChange('taxId')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CNSS Code</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 focus:bg-white transition-all" 
                placeholder="Enter CNSS code" 
                value={form.cnssCode}
                onChange={onChange('cnssCode')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input 
                type="url" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 focus:bg-white transition-all" 
                placeholder="https://yourcompany.com" 
                value={form.website}
                onChange={onChange('website')}
              />
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 flex items-center justify-center">
              <Icon icon="solar:wallet-money-bold-duotone" className="text-[#3c959d]" width={16} height={16} />
            </span>
            <h3 className="text-lg font-semibold text-gray-900">Business Preferences</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 focus:bg-white transition-all" 
                placeholder="e.g., TND, USD" 
                value={form.currency}
                onChange={onChange('currency')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 focus:bg-white transition-all" 
                placeholder="e.g., Small, Medium, Large" 
                value={form.size}
                onChange={onChange('size')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 focus:bg-white transition-all" 
                placeholder="e.g., Retail, Services" 
                value={form.industry}
                onChange={onChange('industry')}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Icon icon="solar:info-circle-bold-duotone" width={16} height={16} />
            Changes will be applied to all new invoices and receipts
          </p>
          
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              className="px-6 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#3c959d] to-[#ef7335] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <Icon icon="solar:check-circle-bold" width={16} height={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


