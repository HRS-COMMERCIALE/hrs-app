'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { usePointOfSale, useCreatePointOfSale, useUpdatePointOfSale, useDeletePointOfSale } from '../../../../hooks/usePointOfSale';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner/LoadingSpinner';
import { Store } from 'lucide-react';

interface PointOfSale {
  id: number;
  pointOfSale: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

interface CreatePointOfSaleData {
  pointOfSale: string;
  location: string;
}

interface UpdatePointOfSaleData {
  id: number;
  pointOfSale: string;
  location: string;
}

export default function PointOfSale() {
  // React Query hooks
  const { data: pointsOfSale = [], isLoading, error, refetch } = usePointOfSale();
  const createMutation = useCreatePointOfSale();
  const updateMutation = useUpdatePointOfSale();
  const deleteMutation = useDeletePointOfSale();

  // Local state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<keyof PointOfSale>('pointOfSale');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingPoint, setEditingPoint] = useState<PointOfSale | null>(null);
  const [deletingPoints, setDeletingPoints] = useState<number[]>([]);
  
  // Form states
  const [formData, setFormData] = useState<CreatePointOfSaleData>({
    pointOfSale: '',
    location: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Optimized filtered and sorted points of sale using useMemo
  const filteredPoints = useMemo(() => {
    let filtered = pointsOfSale.filter(point =>
      point.pointOfSale.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.location.toLowerCase().includes(searchQuery.toLowerCase())
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
  }, [pointsOfSale, searchQuery, sortField, sortDirection]);

  // Optimized mutation handlers with useCallback
  const handleCreatePointOfSale = useCallback(async (data: CreatePointOfSaleData) => {
    try {
      await createMutation.mutateAsync(data);
      setSuccessMessage('Point of sale created successfully!');
      setShowCreateModal(false);
      resetForm();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      // Error is handled by React Query
    }
  }, [createMutation]);

  const handleUpdatePointOfSale = useCallback(async (data: UpdatePointOfSaleData) => {
    try {
      await updateMutation.mutateAsync(data);
      setSuccessMessage('Point of sale updated successfully!');
      setShowEditModal(false);
      setEditingPoint(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      // Error is handled by React Query
    }
  }, [updateMutation]);

  const handleDeletePointOfSale = useCallback(async (ids: number[]) => {
    try {
      await deleteMutation.mutateAsync(ids);
      setSuccessMessage(`Successfully deleted ${ids.length} point(s) of sale`);
      setDeletingPoints([]);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      // Error is handled by React Query
    }
  }, [deleteMutation]);

  // Form validation
  const validateForm = (data: CreatePointOfSaleData) => {
    const errors: Record<string, string> = {};
    
    if (!data.pointOfSale.trim()) {
      errors.pointOfSale = 'Point of sale name is required';
    }
    
    if (!data.location.trim()) {
      errors.location = 'Location is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form handlers
  const handleInputChange = (field: keyof CreatePointOfSaleData) => (
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
    
    await handleCreatePointOfSale(formData);
  }, [formData, handleCreatePointOfSale]);

  const handleEdit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingPoint || !validateForm(formData)) {
      return;
    }
    
    await handleUpdatePointOfSale({
      id: editingPoint.id,
      ...formData
    });
  }, [editingPoint, formData, handleUpdatePointOfSale]);

  const handleEditClick = (point: PointOfSale) => {
    setEditingPoint(point);
    setFormData({
      pointOfSale: point.pointOfSale,
      location: point.location
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingPoints([id]);
  };

  const confirmDelete = useCallback(async () => {
    if (deletingPoints.length > 0) {
      await handleDeletePointOfSale(deletingPoints);
    }
  }, [deletingPoints, handleDeletePointOfSale]);

  const resetForm = () => {
    setFormData({
      pointOfSale: '',
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
    setEditingPoint(null);
    resetForm();
  };

  // Get current error and loading states
  const currentError = error?.message || createMutation.error?.message || updateMutation.error?.message || deleteMutation.error?.message;
  const isSubmitting = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleSort = (field: keyof PointOfSale) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof PointOfSale) => {
    if (sortField !== field) {
      return 'solar:sort-vertical-bold-duotone';
    }
    return sortDirection === 'asc' ? 'solar:sort-vertical-asc-bold-duotone' : 'solar:sort-vertical-desc-bold-duotone';
  };

  const getSortIconColor = (field: keyof PointOfSale) => {
    if (sortField !== field) {
      return 'text-gray-400';
    }
    return 'text-[#3c959d]';
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner 
            icon={Store}
            message="Loading points of sale..."
            variant="default"
            size="md"
          />
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
              <Icon icon="solar:cart-large-2-bold-duotone" className="text-[#3c959d]" width={20} height={20} />
            </span>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Point of Sale Management</h3>
              <p className="text-sm text-gray-600">Manage and configure your point of sale locations</p>
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
              Add New POS
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={16} height={16} />
            <input
              type="text"
              placeholder="Search by point of sale name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d] focus:bg-white transition-all text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="h-2 w-2 rounded-full bg-[#3c959d]"></span>
            {filteredPoints.length} of {pointsOfSale.length} points
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
                    onClick={() => handleSort('pointOfSale')}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-[#3c959d] transition-colors"
                  >
                    Point of Sale
                    <Icon icon={getSortIcon('pointOfSale')} className={getSortIconColor('pointOfSale')} width={14} height={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('location')}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-[#3c959d] transition-colors"
                  >
                    Location
                    <Icon icon={getSortIcon('location')} className={getSortIconColor('location')} width={14} height={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <button
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-700 uppercase tracking-wider hover:text-[#3c959d] transition-colors"
                  >
                    Created
                    <Icon icon={getSortIcon('createdAt')} className={getSortIconColor('createdAt')} width={14} height={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left">
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPoints.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Icon icon="solar:cart-large-2-bold-duotone" className="mx-auto mb-2 text-gray-300" width={32} height={32} />
                      <p className="text-sm">No points of sale found</p>
                      {searchQuery && <p className="text-xs mt-1">Try adjusting your search terms</p>}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPoints.map((point) => (
                  <tr key={point.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#3c959d]/15 to-[#ef7335]/15 flex items-center justify-center">
                          <Icon icon="solar:cart-large-2-bold-duotone" className="text-[#3c959d]" width={14} height={14} />
                        </span>
                        <span className="font-medium text-gray-900">{point.pointOfSale}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:map-point-bold-duotone" className="text-gray-400" width={14} height={14} />
                        <span className="text-gray-700">{point.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {new Date(point.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditClick(point)}
                          className="h-8 w-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors" 
                          title="Edit"
                        >
                          <Icon icon="solar:pen-bold-duotone" className="text-gray-500 hover:text-[#3c959d]" width={14} height={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(point.id)}
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
            Points of sale are used for transaction tracking and location management
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
              <h3 className="text-lg font-semibold text-gray-900">Add New Point of Sale</h3>
              <button onClick={closeCreateModal} className="text-gray-400 hover:text-gray-600">
                <Icon icon="solar:close-circle-bold" width={24} height={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Point of Sale Name *</label>
                <input
                  type="text"
                  value={formData.pointOfSale}
                  onChange={handleInputChange('pointOfSale')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]/20"
                  placeholder="e.g., Main Store"
                />
                {formErrors.pointOfSale && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.pointOfSale}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={handleInputChange('location')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]/20"
                  placeholder="e.g., Downtown Branch"
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
      {showEditModal && editingPoint && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Point of Sale</h3>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600">
                <Icon icon="solar:close-circle-bold" width={24} height={24} />
              </button>
            </div>
            
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Point of Sale Name *</label>
                <input
                  type="text"
                  value={formData.pointOfSale}
                  onChange={handleInputChange('pointOfSale')}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]/20"
                />
                {formErrors.pointOfSale && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.pointOfSale}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
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
      {deletingPoints.length > 0 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <div className="h-16 w-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-red-600" width={32} height={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete {deletingPoints.length} point(s) of sale? This action cannot be undone.
              </p>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDeletingPoints([])}
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
