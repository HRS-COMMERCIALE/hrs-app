'use client';

import { useState } from 'react';
import { useArticles, useDeleteArticle } from '@/hooks/useArticles';
import { useSuppliers } from '@/hooks/useSuppliers';
import { ArticleItem } from '@/hooks/useArticles';
import ArticleForm from '@/components/pages/dashboard/operations/inventory/ArticleForm';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner/LoadingSpinner';
import { Package, Trash2 } from 'lucide-react';

export default function InventoryPage() {
  const formatPrice = (value: unknown) => {
    const numericValue =
      typeof value === 'number'
        ? value
        : typeof value === 'string'
        ? parseFloat(value)
        : NaN;
    return Number.isFinite(numericValue) ? `$${numericValue.toFixed(2)}` : 'N/A';
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<'product' | 'service' | ''>('');
  const [selectedNature, setSelectedNature] = useState<'local' | 'importe' | ''>('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; article: ArticleItem | null }>({
    isOpen: false,
    article: null
  });

  const { data: articlesData, isLoading, error } = useArticles({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined,
    typeArticle: selectedType || undefined,
    natureArticle: selectedNature || undefined,
  });

  const { data: suppliers } = useSuppliers();
  const deleteArticleMutation = useDeleteArticle();

  const handleDelete = async (article: ArticleItem) => {
    try {
      await deleteArticleMutation.mutateAsync(article.id);
      setDeleteConfirm({ isOpen: false, article: null });
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const openDeleteConfirm = (article: ArticleItem) => {
    setDeleteConfirm({ isOpen: true, article });
  };

  const handleEdit = (article: ArticleItem) => {
    setEditingArticle(article);
    setShowAddModal(true);
  };

  const handleAddNew = () => {
    setEditingArticle(null);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingArticle(null);
  };

  // Get articles list and pagination info
  const articles = articlesData?.data || [];
  const pagination = articlesData?.pagination;

  if (isLoading) {
    return (
      <div className="w-full max-w-none px-4 pt-4">
        <div className="bg-white/80 rounded-2xl border border-gray-200 p-6">
          <LoadingSpinner 
            icon={Package}
            message="Loading articles..."
            variant="default"
            size="md"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-none px-4 pt-4">
        <div className="bg-white/80 rounded-2xl border border-red-200 p-6 text-center text-red-600">
          <Icon icon="solar:danger-circle-bold-duotone" className="mx-auto mb-2" width={24} height={24} />
          {error?.message || 'Failed to load articles'}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1800px] mx-auto px-2 md:px-6 lg:px-8 pt-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 flex items-center justify-center">
              <Icon icon="solar:box-bold-duotone" className="text-[#3c959d]" width={20} height={20} />
            </span>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Inventory Management</h3>
              <p className="text-sm text-gray-600">Manage your articles and inventory</p>
            </div>
          </div>
          <div className="flex items-center gap-3 relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddNew}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3c959d] to-[#ef7335] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <Icon icon="solar:add-circle-bold-duotone" width={16} height={16} />
              Add Article
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setExportOpen((v) => !v)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors flex items-center gap-2"
              title="Export options"
            >
              <Icon icon="solar:document-bold-duotone" width={16} height={16} />
              Export
              <Icon icon="solar:alt-arrow-down-bold" width={14} height={14} />
            </motion.button>
            {exportOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10"
              >
                <button onClick={() => {}} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                  <Icon icon="solar:printer-bold-duotone" width={14} height={14} />
                  Print inventory
                </button>
                <button onClick={() => {}} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                  <Icon icon="solar:document-text-bold-duotone" width={14} height={14} />
                  Export to PDF
                </button>
                <button onClick={() => {}} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                  <Icon icon="solar:download-bold-duotone" width={14} height={14} />
                  Download Excel
                </button>
              </motion.div>
            )}
          </div>
        </div>

        <div className="space-y-4 lg:space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={16} height={16} />
              <input
                type="text"
                placeholder="Search by name, brand, barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d] focus:bg-white transition-all text-sm"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="h-2 w-2 rounded-full bg-[#3c959d]"></span>
              {pagination?.totalItems || 0} articles
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as 'product' | 'service' | '')}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d] appearance-none"
              >
                <option value="">All Types</option>
                <option value="product">Product</option>
                <option value="service">Service</option>
              </select>
              <Icon icon="solar:alt-arrow-down-bold-duotone" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width={14} height={14} />
            </div>
            <div className="relative">
              <select
                value={selectedNature}
                onChange={(e) => setSelectedNature(e.target.value as 'local' | 'importe' | '')}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d] appearance-none"
              >
                <option value="">All Natures</option>
                <option value="local">Local</option>
                <option value="importe">Imported</option>
              </select>
              <Icon icon="solar:alt-arrow-down-bold-duotone" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width={14} height={14} />
            </div>
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedType('');
                  setSelectedNature('');
                  setSearchTerm('');
                }}
                className="px-4 py-2.5 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </motion.button>
            </div>
          </div>
        </div>

        {/* Reports & Status Section */}
        <div className="mt-6 lg:mt-8 p-4 lg:p-6 bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#3c959d] to-[#ef7335] flex items-center justify-center">
              <Icon icon="solar:chart-bold-duotone" className="text-white" width={12} height={12} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Reports & Status</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-3 bg-white/80 rounded-lg border border-gray-200 hover:border-[#3c959d] hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-8 w-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors flex items-center justify-center mb-2">
                  <Icon icon="solar:box-bold-duotone" className="text-blue-600" width={16} height={16} />
                </div>
                <h4 className="text-xs font-medium text-gray-900 mb-1">State of Items</h4>
                <p className="text-xs text-gray-500">Article status</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-3 bg-white/80 rounded-lg border border-gray-200 hover:border-[#3c959d] hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-8 w-8 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors flex items-center justify-center mb-2">
                  <Icon icon="solar:archive-bold-duotone" className="text-green-600" width={16} height={16} />
                </div>
                <h4 className="text-xs font-medium text-gray-900 mb-1">Stock Status</h4>
                <p className="text-xs text-gray-500">Current levels</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-3 bg-white/80 rounded-lg border border-gray-200 hover:border-[#3c959d] hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-8 w-8 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors flex items-center justify-center mb-2">
                  <Icon icon="solar:danger-triangle-bold-duotone" className="text-red-600" width={16} height={16} />
                </div>
                <h4 className="text-xs font-medium text-gray-900 mb-1">Out-of-Stock</h4>
                <p className="text-xs text-gray-500">Need restock</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-3 bg-white/80 rounded-lg border border-gray-200 hover:border-[#3c959d] hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-8 w-8 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors flex items-center justify-center mb-2">
                  <Icon icon="solar:printer-bold-duotone" className="text-purple-600" width={16} height={16} />
                </div>
                <h4 className="text-xs font-medium text-gray-900 mb-1">Barcode Print</h4>
                <p className="text-xs text-gray-500">Generate labels</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-3 bg-white/80 rounded-lg border border-gray-200 hover:border-[#3c959d] hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="h-8 w-8 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors flex items-center justify-center mb-2">
                  <Icon icon="solar:dollar-bold-duotone" className="text-orange-600" width={16} height={16} />
                </div>
                <h4 className="text-xs font-medium text-gray-900 mb-1">Stock Valuation</h4>
                <p className="text-xs text-gray-500">Financial value</p>
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th className="px-6 lg:px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Article</th>
                <th className="px-6 lg:px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                <th className="px-6 lg:px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Family</th>
                <th className="px-6 lg:px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Supplier</th>
                <th className="px-6 lg:px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stock</th>
                <th className="px-6 lg:px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                <th className="px-6 lg:px-8 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 lg:px-8 py-12 text-center">
                    <div className="text-gray-500">
                      <Icon icon="solar:box-bold-duotone" className="mx-auto mb-2 text-gray-300" width={32} height={32} />
                      <p className="text-sm">No articles found</p>
                      {searchTerm && <p className="text-xs mt-1">Try adjusting your search terms</p>}
                    </div>
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <motion.tr
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 lg:px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-gradient-to-br from-[#3c959d]/15 to-[#ef7335]/15 flex items-center justify-center">
                          {article.imageUrl ? (
                            <img
                              src={article.imageUrl}
                              alt={article.article}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Icon icon="solar:box-bold-duotone" className="text-[#3c959d]" width={20} height={20} />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{article.article}</div>
                          {article.marque && (
                            <div className="text-sm text-gray-500">{article.marque}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 lg:px-8 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.typeArticle === 'product' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {article.typeArticle || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 lg:px-8 py-4 text-gray-700">{article.family?.name || 'N/A'}</td>
                    <td className="px-6 lg:px-8 py-4 text-gray-700">{article.supplier?.name || article.fournisseur || 'N/A'}</td>
                    <td className="px-6 lg:px-8 py-4 text-gray-700">{article.qteEnStock || 0}</td>
                    <td className="px-6 lg:px-8 py-4 text-gray-700">
                      {formatPrice(article.prixVenteTTC)}
                    </td>
                    <td className="px-6 lg:px-8 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(article)}
                          className="p-2 text-[#3c959d] hover:bg-[#3c959d]/10 rounded-lg transition-colors"
                          title="Edit article"
                        >
                          <Icon icon="solar:pen-bold-duotone" width={16} height={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openDeleteConfirm(article)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete article"
                        >
                          <Icon icon="solar:trash-bin-trash-bold-duotone" width={16} height={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="bg-gray-50/80 border-t border-gray-200 px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                {pagination.totalItems} results
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </motion.button>
                <span className="px-3 py-2 text-sm font-medium text-gray-700">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <ArticleForm
            article={editingArticle}
            onClose={handleCloseModal}
            onSuccess={() => {
              // Optionally refresh data or show success message
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.isOpen && deleteConfirm.article && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200/50"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <Icon icon="solar:danger-triangle-bold-duotone" className="text-red-600" width={24} height={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Article</h3>
                    <p className="text-sm text-gray-600">This action cannot be undone</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700">
                    Are you sure you want to delete <span className="font-semibold">{deleteConfirm.article.article}</span>?
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    All associated data will be permanently removed.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeleteConfirm({ isOpen: false, article: null })}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDelete(deleteConfirm.article!)}
                    disabled={deleteArticleMutation.isPending}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {deleteArticleMutation.isPending ? (
                      <div className="flex items-center">
                        <LoadingSpinner 
                          icon={Trash2}
                          size="sm"
                          variant="minimal"
                        />
                        <span className="ml-2">Deleting...</span>
                      </div>
                    ) : (
                      <>
                        <Icon icon="solar:trash-bin-trash-bold-duotone" width={16} height={16} />
                        Delete
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
