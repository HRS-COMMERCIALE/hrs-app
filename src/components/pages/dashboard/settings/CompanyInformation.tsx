'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useAuth } from '@/store/authProvider';
import { useCompanyInformation, useUpdateCompanyInformation } from '../../../../hooks/useCompanyInformation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner/LoadingSpinner';
import { Building2, Upload, Save } from 'lucide-react';

// Move options outside component for better performance
const currencyOptions = [
  { value: 'TND', label: 'Tunisian Dinar (TND)' },
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'British Pound (GBP)' },
  { value: 'CAD', label: 'Canadian Dollar (CAD)' },
  { value: 'AUD', label: 'Australian Dollar (AUD)' },
];

const sizeOptions = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '500+', label: '500+ employees' },
];

const industryOptions = [
  { value: 'Technology', label: 'Technology' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Finance', label: 'Finance & Banking' },
  { value: 'Retail', label: 'Retail & E-commerce' },
  { value: 'Manufacturing', label: 'Manufacturing' },
  { value: 'Education', label: 'Education' },
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Transportation', label: 'Transportation & Logistics' },
  { value: 'Food & Beverage', label: 'Food & Beverage' },
  { value: 'Consulting', label: 'Consulting & Professional Services' },
  { value: 'Other', label: 'Other' },
];

export default function CompanyInformation() {
  const { checkAuth } = useAuth();
  
  // React Query hooks
  const { data: companyData, isLoading, error, refetch } = useCompanyInformation();
  const updateMutation = useUpdateCompanyInformation();

  // Local state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState<boolean>(false);
  
  // Form state - initialize with company data
  const [form, setForm] = useState({
    businessName: '',
    registrationNumber: '',
    taxId: '',
    cnssCode: '',
    website: '',
    currency: '',
    size: '',
    industry: '',
    logoFile: '',
  });

  // Initialize form when data is loaded
  React.useEffect(() => {
    if (companyData) {
      setForm(companyData);
    }
  }, [companyData]);

  // Optimized form handlers with useCallback
  const onChange = useCallback((key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }, []);

  const handleLogoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      // Handle validation error - could show a toast or set a local error state
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      // Handle validation error - could show a toast or set a local error state
      return;
    }

    setUploadingLogo(true);
    
    try {
      // Set file for upload on Save and preview locally now
      setSelectedLogoFile(file);
      const objectUrl = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, logoFile: objectUrl }));
    } catch (err: any) {
      // Handle error - could show a toast or set a local error state
    } finally {
      setUploadingLogo(false);
    }
  }, []);

  const removeLogo = useCallback(() => {
    setForm(prev => ({ ...prev, logoFile: companyData?.logoFile || '' }));
    setSelectedLogoFile(null);
  }, [companyData?.logoFile]);

  // Optimized validation with useMemo
  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    // Required field validations
    if (!form.businessName.trim()) {
      errors.businessName = 'Business name is required';
    } else if (form.businessName.trim().length < 2) {
      errors.businessName = 'Business name must be at least 2 characters';
    }

    if (!form.currency.trim()) {
      errors.currency = 'Currency is required';
    }

    if (!form.size.trim()) {
      errors.size = 'Company size is required';
    }

    if (!form.industry.trim()) {
      errors.industry = 'Industry is required';
    }

    // Optional field validations
    if (form.website.trim() && !isValidUrl(form.website)) {
      errors.website = 'Please enter a valid website URL';
    }

    if (form.taxId.trim() && form.taxId.trim().length < 3) {
      errors.taxId = 'Tax ID must be at least 3 characters';
    }

    if (form.cnssCode.trim() && form.cnssCode.trim().length < 3) {
      errors.cnssCode = 'CNSS Code must be at least 3 characters';
    }

    return errors;
  }, [form]);

  const isValidUrl = useCallback((string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }, []);

  const isFormValid = Object.keys(validationErrors).length === 0;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        businessName: form.businessName,
        registrationNumber: form.registrationNumber,
        taxId: form.taxId,
        cnssCode: form.cnssCode,
        website: form.website,
        currency: form.currency,
        size: form.size,
        industry: form.industry,
        logo: selectedLogoFile || undefined,
      });

      setSuccessMessage('Company information updated successfully!');
      setSelectedLogoFile(null);
      // Immediately refresh auth context so header/sidebar reflect new logo/name
      checkAuth();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

    } catch (err: any) {
      // Error is handled by React Query
    }
  }, [form, isFormValid, selectedLogoFile, updateMutation, checkAuth]);

  const handleCancel = useCallback(() => {
    if (companyData) {
      setForm(companyData);
    }
    setSelectedLogoFile(null);
    setSuccessMessage(null);
  }, [companyData]);

  const getFieldError = useCallback((fieldName: string) => {
    return validationErrors[fieldName];
  }, [validationErrors]);

  const hasFieldError = useCallback((fieldName: string) => {
    return !!validationErrors[fieldName];
  }, [validationErrors]);

  // Get current error and loading states
  const currentError = error?.message || updateMutation.error?.message;
  const isSubmitting = updateMutation.isPending;
console.log("form",form);
  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      {isLoading && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <LoadingSpinner 
            icon={Building2}
            message="Loading company information..."
            variant="default"
            size="sm"
          />
        </div>
      )}
      
      {currentError && (
        <div className="mb-4 text-sm text-red-600 flex items-center gap-2">
          <Icon icon="solar:danger-triangle-bold-duotone" width={16} height={16} />
          {currentError}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 text-sm text-green-600 flex items-center gap-2">
          <Icon icon="solar:check-circle-bold-duotone" width={16} height={16} />
          {successMessage}
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
                required
                disabled={isSubmitting}
              />
              {hasFieldError('businessName') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('businessName')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 focus:bg-white transition-all" 
                placeholder="TN-123456" 
                value={form.registrationNumber}
                onChange={onChange('registrationNumber')}
                disabled={isSubmitting}
              />
              {/* Registration Number currently optional */}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 focus:bg-white transition-all" 
                placeholder="Enter tax identification number" 
                value={form.taxId}
                onChange={onChange('taxId')}
                disabled={isSubmitting}
              />
              {hasFieldError('taxId') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('taxId')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CNSS Code</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 focus:bg-white transition-all" 
                placeholder="Enter CNSS code" 
                value={form.cnssCode}
                onChange={onChange('cnssCode')}
                disabled={isSubmitting}
              />
              {hasFieldError('cnssCode') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('cnssCode')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input 
                type="url" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 focus:bg-white transition-all" 
                placeholder="https://yourcompany.com" 
                value={form.website}
                onChange={onChange('website')}
                disabled={isSubmitting}
              />
              {hasFieldError('website') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('website')}</p>
              )}
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
              <select 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 focus:bg-white transition-all" 
                value={form.currency}
                onChange={onChange('currency')}
                disabled={isSubmitting}
              >
                <option value="">Select Currency</option>
                {currencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {hasFieldError('currency') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('currency')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 focus:bg-white transition-all" 
                value={form.size}
                onChange={onChange('size')}
                disabled={isSubmitting}
              >
                <option value="">Select Company Size</option>
                {sizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {hasFieldError('size') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('size')}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 focus:bg-white transition-all" 
                value={form.industry}
                onChange={onChange('industry')}
                disabled={isSubmitting}
              >
                <option value="">Select Industry</option>
                {industryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {hasFieldError('industry') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('industry')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Company Logo Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 flex items-center justify-center">
              <Icon icon="solar:gallery-bold-duotone" className="text-[#3c959d]" width={16} height={16} />
            </span>
            <h3 className="text-lg font-semibold text-gray-900">Company Logo</h3>
          </div>

          <div className="flex items-center gap-6">
            {/* Logo Preview */}
            <div className="flex-shrink-0">
              <div className="relative">
                {form.logoFile ? (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-gray-200 bg-white shadow-sm">
                    <Image 
                      src={form.logoFile} 
                      alt="Company Logo" 
                      width={80} 
                      height={80} 
                      className="w-full h-full object-cover"
                      unoptimized={true}
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                    <Icon icon="solar:gallery-bold-duotone" className="text-gray-400" width={24} height={24} />
                  </div>
                )}
                
                {/* Remove Button */}
                {form.logoFile && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                    title="Remove logo"
                    disabled={isSubmitting}
                  >
                    <Icon icon="solar:close-circle-bold" width={12} height={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Upload Controls */}
            <div className="flex-1">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={uploadingLogo || isSubmitting}
                    />
                    
                    <span className={`
                      inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-[#3c959d] transition-all duration-200
                      ${(uploadingLogo || isSubmitting) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}>
                      {uploadingLogo ? (
                        <div className="flex items-center">
                          <LoadingSpinner 
                            icon={Upload}
                            size="sm"
                            variant="minimal"
                          />
                          <span className="ml-2">Uploading...</span>
                        </div>
                      ) : (
                        <>
                          <Icon icon="solar:upload-bold-duotone" width={16} height={16} />
                          {form.logoFile ? 'Change Logo' : 'Upload Logo'}
                        </>
                      )}
                    </span>
                  </label>
                  
                  {form.logoFile && (
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="px-3 py-2.5 rounded-lg border border-red-300 bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-colors"
                      disabled={isSubmitting}
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>• Max 5MB</span>
                  <span>• JPG, PNG, GIF</span>
                  <span>• 200x200px recommended</span>
                </div>
              </div>
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
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                                    disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#3c959d] to-[#ef7335] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Icon icon="solar:check-circle-bold" width={16} height={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}


