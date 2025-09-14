'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { usePostalCodes, useCreatePostalCode, useUpdatePostalCode, useDeletePostalCodes } from '../../../../hooks/usePostalCodes';

interface PostalCode {
  id: number;
  governorate: string;
  code: string;
  city: string;
  location: string;
}

interface CreatePostalCodeData {
  governorate: string;
  code: string;
  city: string;
  location: string;
}

interface UpdatePostalCodeData {
  id: number;
  governorate: string;
  code: string;
  city: string;
  location: string;
}

export default function PostalCodes() {
  // React Query hooks
  const { data: postalCodes = [], isLoading, error, refetch } = usePostalCodes();
  const createMutation = useCreatePostalCode();
  const updateMutation = useUpdatePostalCode();
  const deleteMutation = useDeletePostalCodes();

  // Local state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<keyof PostalCode>('governorate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingCode, setEditingCode] = useState<PostalCode | null>(null);
  const [deletingCodes, setDeletingCodes] = useState<number[]>([]);
  
  // Form states
  const [formData, setFormData] = useState<CreatePostalCodeData>({
    governorate: '',
    code: '',
    city: '',
    location: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Optimized filtered and sorted postal codes using useMemo
  const filteredCodes = useMemo(() => {
    let filtered = postalCodes.filter(code =>
      code.governorate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort the filtered results
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [postalCodes, searchQuery, sortField, sortDirection]);

  // Optimized mutation handlers with useCallback
  const handleCreatePostalCode = useCallback(async (data: CreatePostalCodeData) => {
    try {
      await createMutation.mutateAsync(data);
      setSuccessMessage('Postal code created successfully!');
      setShowCreateModal(false);
      resetForm();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      // Error is handled by React Query
    }
  }, [createMutation]);

  const handleUpdatePostalCode = useCallback(async (data: UpdatePostalCodeData) => {
    try {
      await updateMutation.mutateAsync(data);
      setSuccessMessage('Postal code updated successfully!');
      setShowEditModal(false);
      setEditingCode(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      // Error is handled by React Query
    }
  }, [updateMutation]);

  const handleDeletePostalCodes = useCallback(async (ids: number[]) => {
    try {
      await deleteMutation.mutateAsync(ids);
      setSuccessMessage(`Successfully deleted ${ids.length} postal code(s)`);
      setDeletingCodes([]);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      // Error is handled by React Query
    }
  }, [deleteMutation]);

  // Form validation
  const validateForm = (data: CreatePostalCodeData) => {
    const errors: Record<string, string> = {};
    
    if (!data.governorate.trim()) {
      errors.governorate = 'Governorate is required';
    }
    
    if (!data.code.trim()) {
      errors.code = 'Code is required';
    }
    
    if (!data.city.trim()) {
      errors.city = 'City is required';
    }
    
    if (!data.location.trim()) {
      errors.location = 'Location is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form handlers
  const handleInputChange = (field: keyof CreatePostalCodeData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }
    
    await handleCreatePostalCode(formData);
  }, [formData, handleCreatePostalCode]);

  const handleEdit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCode || !validateForm(formData)) {
      return;
    }
    
    await handleUpdatePostalCode({
      id: editingCode.id,
      ...formData
    });
  }, [editingCode, formData, handleUpdatePostalCode]);

  const handleEditClick = (code: PostalCode) => {
    setEditingCode(code);
    setFormData({
      governorate: code.governorate,
      code: code.code,
      city: code.city,
      location: code.location
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingCodes([id]);
  };

  const confirmDelete = useCallback(async () => {
    if (deletingCodes.length > 0) {
      await handleDeletePostalCodes(deletingCodes);
    }
  }, [deletingCodes, handleDeletePostalCodes]);

  const resetForm = () => {
    setFormData({
      governorate: '',
      code: '',
      city: '',
      location: ''
    });
    setFormErrors({});
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingCode(null);
    resetForm();
  };

  // Get current error and loading states
  const currentError = error?.message || createMutation.error?.message || updateMutation.error?.message || deleteMutation.error?.message;
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleSort = (field: keyof PostalCode) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof PostalCode) => {
    if (sortField !== field) {
      return 'solar:sort-vertical-bold-duotone';
    }
    return sortDirection === 'asc' ? 'solar:sort-vertical-asc-bold-duotone' : 'solar:sort-vertical-desc-bold-duotone';
  };

  const getSortIconColor = (field: keyof PostalCode) => {
    if (sortField !== field) {
      return 'text-gray-400';
    }
    return 'text-[#3c959d]';
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 flex items-center justify-center mx-auto mb-4">
              <Icon icon="solar:refresh-bold-duotone" className="text-[#3c959d] animate-spin" width={32} height={32} />
            </div>
            <p className="text-gray-600">Loading postal codes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      {currentError && (
        <div className="mb-6 text-sm text-red-600 flex items-center gap-2">
          <Icon icon="solar:danger-triangle-bold-duotone" width={16} height={16} />
          {currentError}
        </div>
      )}

      {successMessage && (
        <div className="mb-6 text-sm text-green-600 flex items-center gap-2">
          <Icon icon="solar:check-circle-bold-duotone" width={16} height={16} />
          {successMessage}
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 flex items-center justify-center">
              <Icon icon="mdi:mailbox-outline" className="text-[#3c959d]" width={20} height={20} />
            </span>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Postal Codes Database</h3>
              <p className="text-sm text-gray-600">Manage and configure postal code information</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="h-10 w-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors">
              <Icon icon="solar:question-circle-bold-duotone" className="text-gray-500" width={18} height={18} />
            </button>
            <button 
              onClick={openCreateModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3c959d] to-[#ef7335] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <Icon icon="solar:add-circle-bold-duotone" width={16} height={16} />
              Add New Code
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={16} height={16} />
            <input
              type="text"
              placeholder="Search by governorate, code, city, or locality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d] focus:bg-white transition-all text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="h-2 w-2 rounded-full bg-[#3c959d]"></span>
            {filteredCodes.length} of {postalCodes.length} codes
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('governorate')}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-[#3c959d] transition-colors"
                  >
                    Governorate
                    <Icon icon={getSortIcon('governorate')} className={getSortIconColor('governorate')} width={14} height={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('code')}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-[#3c959d] transition-colors"
                  >
                    Code
                    <Icon icon={getSortIcon('code')} className={getSortIconColor('code')} width={14} height={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('city')}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-[#3c959d] transition-colors"
                  >
                    City
                    <Icon icon={getSortIcon('city')} className={getSortIconColor('city')} width={14} height={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('location')}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-[#3c959d] transition-colors"
                  >
                    Locality
                    <Icon icon={getSortIcon('location')} className={getSortIconColor('location')} width={14} height={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCodes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Icon icon="solar:search-bold-duotone" className="mx-auto mb-2 text-gray-300" width={32} height={32} />
                      <p className="text-sm">No postal codes found</p>
                      {searchQuery && <p className="text-xs mt-1">Try adjusting your search terms</p>}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCodes.map((code) => (
                  <tr key={code.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#3c959d]/15 to-[#ef7335]/15 flex items-center justify-center">
                          <Icon icon="mdi:map-marker" className="text-[#3c959d]" width={14} height={14} />
                        </span>
                        <span className="font-medium text-gray-900">{code.governorate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {code.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{code.city}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{code.location}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditClick(code)}
                          className="h-8 w-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors" 
                          title="Edit"
                        >
                          <Icon icon="solar:pen-bold-duotone" className="text-gray-500 hover:text-[#3c959d]" width={14} height={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(code.id)}
                          className="h-8 w-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors" 
                          title="Delete"
                        >
                          <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-gray-500 hover:text-red-500" width={14} height={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            <Icon icon="solar:info-circle-bold-duotone" width={14} height={14} />
            Postal codes are used for address validation and shipping calculations
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <span>Last updated: {new Date().toLocaleDateString()}</span>
          <button 
            onClick={() => refetch()}
            className="text-[#3c959d] hover:text-[#ef7335] transition-colors flex items-center gap-1"
          >
            <Icon icon="solar:refresh-bold-duotone" width={14} height={14} />
            Refresh
          </button>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Postal Code</h3>
              <button onClick={closeCreateModal} className="text-gray-400 hover:text-gray-600">
                <Icon icon="solar:close-circle-bold" width={24} height={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Governorate *</label>
                <input
                  type="text"
                  value={formData.governorate}
                  onChange={handleInputChange('governorate')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]/20"
                  placeholder="e.g., Tunis"
                />
                {formErrors.governorate && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.governorate}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={handleInputChange('code')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]/20"
                  placeholder="e.g., TN-1000"
                />
                {formErrors.code && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.code}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange('city')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]/20"
                  placeholder="e.g., Tunis"
                />
                {formErrors.city && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.city}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Locality *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange('location')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]/20"
                  placeholder="e.g., Tunis Centre"
                />
                {formErrors.location && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.location}</p>
                )}
              </div>
              
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#3c959d] to-[#ef7335] text-white font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingCode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Postal Code</h3>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600">
                <Icon icon="solar:close-circle-bold" width={24} height={24} />
              </button>
            </div>
            
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Governorate *</label>
                <input
                  type="text"
                  value={formData.governorate}
                  onChange={handleInputChange('governorate')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]/20"
                />
                {formErrors.governorate && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.governorate}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={handleInputChange('code')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]/20"
                />
                {formErrors.code && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.code}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange('city')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]/20"
                />
                {formErrors.city && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.city}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Locality *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange('location')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]/20"
                />
                {formErrors.location && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.location}</p>
                )}
              </div>
              
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#3c959d] to-[#3c959d] text-white font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCodes.length > 0 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-red-600" width={32} height={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {deletingCodes.length} postal code(s)? This action cannot be undone.
              </p>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDeletingCodes([])}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
