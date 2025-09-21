"use client";

import React, { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { useOrders, useCreateOrder, useUpdateOrder, useDeleteOrder, OrderItem } from '@/hooks/useOrders';
import { useArticles } from '@/hooks/useArticles';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner/LoadingSpinner';
import { ShoppingCart } from 'lucide-react';

type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export default function SalesOrderPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [activeSection, setActiveSection] = useState<'all' | 'order' | 'delivery' | 'invoice' | 'returns'>('all');
  const ordersQuery = useOrders({ page: currentPage, limit, search: search || undefined });
  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();
  const deleteOrderMutation = useDeleteOrder();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editing, setEditing] = useState<OrderItem | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { data: articlesResp, isLoading: isArticlesLoading, error: articlesError } = useArticles({ page: 1, limit: 100 });
  const articlesList = (articlesResp?.data || []).map((a: any) => ({ 
    id: a.id, 
    name: a.article, 
    marque: a.marque,
    qteEnStock: a.qteEnStock,
    typeArticle: a.typeArticle,
    prixVenteHT: a.prixVenteHT,
    prixVenteTTC: a.prixVenteTTC,
    pourcentageTVA: a.pourcentageTVA,
    // placeholders
    pourcentageFODEC: a.pourcentageFODEC,
    FODEC: a.FODEC,
    TVASurVente: a.TVASurVente,
    remise: a.remise,
    pourcentageMaxRemise: a.pourcentageMaxRemise
  }));
  const [articleIdError, setArticleIdError] = useState<string | null>(null);

  console.log("articlesList",articlesList);
  const initialForm = useMemo(() => ({
    articleId: '',
    qte: '0',
    prixVHT: '',
    pourcentageRemise: '',
    pourcentageFodec: '',
    pourcentageTVA: '',
    type: 'order' as 'order' | 'delivery' | 'invoice' | 'returns',
  }), []);

  const [form, setForm] = useState<typeof initialForm>(initialForm);
  const selectedArticle = articlesList.find(a => String(a.id) === String((form as any)?.articleId || ''));

  const resetForm = () => setForm(initialForm);


  const orders = ordersQuery.data?.data || [];
  const pagination = ordersQuery.data?.pagination;
  const isLoading = ordersQuery.isLoading;
  const error = ordersQuery.error ? (ordersQuery.error as any)?.message || 'Failed to load orders' : null;

  const sectionCounts = useMemo(() => {
    const base: Record<'all' | 'order' | 'delivery' | 'invoice' | 'returns', number> = {
      all: orders.length,
      order: 0,
      delivery: 0,
      invoice: 0,
      returns: 0,
    };
    for (const o of orders) {
      const key = o.type as 'order' | 'delivery' | 'invoice' | 'returns';
      if (key in base) base[key] += 1;
    }
    return base;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeSection === 'all') return orders;
    return orders.filter(o => o.type === activeSection);
  }, [orders, activeSection]);

  const openCreate = () => {
    setEditing(null);
    setForm(prev => ({
      ...initialForm,
      type: activeSection === 'all' ? 'order' : activeSection,
    }));
    setSubmitError(null);
    setShowModal(true);
  };

  const openEdit = (order: OrderItem) => {
    setEditing(order);
    setForm({
      articleId: String(order.articleId),
      qte: String(order.qte),
      prixVHT: String(order.prixVHT ?? ''),
      pourcentageRemise: order.pourcentageRemise != null ? String(order.pourcentageRemise) : '',
      pourcentageFodec: order.pourcentageFodec != null ? String(order.pourcentageFodec) : '',
      pourcentageTVA: order.pourcentageTVA != null ? String(order.pourcentageTVA) : '',
      type: order.type,
    });
    setSubmitError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    resetForm();
    setSubmitError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'qte') {
      // Only allow digits and prevent empty input
      const cleanValue = value.replace(/[^0-9]/g, '');
      const numeric = cleanValue === '' ? 0 : Number(cleanValue);
      
      // For products with stock management, enforce stock limits
      const isProductWithStock = selectedArticle && 
        selectedArticle.typeArticle === 'product' && 
        selectedArticle.qteEnStock != null;
      
      if (isProductWithStock) {
        const maxStock = Number(selectedArticle.qteEnStock);
        // Allow 0 to be typed, but cap to stock limit if above
        const cappedQty = numeric > maxStock ? maxStock : numeric;
        
        setForm(prev => ({ ...prev, qte: String(cappedQty) }));
        
        // Show error only if user tried to exceed stock
        if (numeric > maxStock) {
          setArticleIdError(`Maximum available stock: ${maxStock}`);
        } else {
          setArticleIdError(null);
        }
      } else {
        // For services or products without stock management, allow any reasonable quantity including 0
        const maxQty = 999999; // Reasonable upper limit
        const cappedQty = numeric > maxQty ? maxQty : numeric;
        
        setForm(prev => ({ ...prev, qte: String(cappedQty) }));
        setArticleIdError(null);
      }
      return;
    }
    
    setForm(prev => ({ ...prev, [name]: value }));
    
    if (name === 'articleId') {
      if (value === '' || articlesList.find(a => String(a.id) === String(value))) {
        setArticleIdError(null);
      } else {
        setArticleIdError('Invalid article ID');
      }
    }
  };

  const toNumberOrNull = (v: string) => (v === '' ? null : Number(v));

  const computed = useMemo(() => {
    const qteNum = Number(form.qte) || 0;
    const unitHT = (form.prixVHT !== '' ? Number(form.prixVHT) : (selectedArticle?.prixVenteHT ?? 0)) || 0;

    // Discount amount: user % > placeholder % > placeholder amount
    const userDiscountPct = form.pourcentageRemise !== '' ? Number(form.pourcentageRemise) : null;
    const placeholderDiscountPct = selectedArticle?.pourcentageMaxRemise != null ? Number(selectedArticle.pourcentageMaxRemise) : null;
    const placeholderDiscountAmt = selectedArticle?.remise != null ? Number(selectedArticle.remise) : null;
    const discountAmt =
      userDiscountPct != null ? unitHT * (userDiscountPct / 100) :
      placeholderDiscountPct != null ? unitHT * (placeholderDiscountPct / 100) :
      placeholderDiscountAmt != null ? placeholderDiscountAmt : 0;

    // FODEC amount: user % > placeholder % > placeholder amount
    const userFodecPct = form.pourcentageFodec !== '' ? Number(form.pourcentageFodec) : null;
    const placeholderFodecPct = selectedArticle?.pourcentageFODEC != null ? Number(selectedArticle.pourcentageFODEC) : null;
    const placeholderFodecAmt = selectedArticle?.FODEC != null ? Number(selectedArticle.FODEC) : null;
    const fodecAmt =
      userFodecPct != null ? unitHT * (userFodecPct / 100) :
      placeholderFodecPct != null ? unitHT * (placeholderFodecPct / 100) :
      placeholderFodecAmt != null ? placeholderFodecAmt : 0;

    const netHT = unitHT - discountAmt + fodecAmt;

    // VAT amount: user % > placeholder % > placeholder amount
    const userTvaPct = form.pourcentageTVA !== '' ? Number(form.pourcentageTVA) : null;
    const placeholderTvaPct = selectedArticle?.pourcentageTVA != null ? Number(selectedArticle.pourcentageTVA) : null;
    const placeholderTvaAmt = selectedArticle?.TVASurVente != null ? Number(selectedArticle.TVASurVente) : null;
    const tvaAmt =
      userTvaPct != null ? netHT * (userTvaPct / 100) :
      placeholderTvaPct != null ? netHT * (placeholderTvaPct / 100) :
      placeholderTvaAmt != null ? placeholderTvaAmt : 0;

    const unitTTC = netHT + tvaAmt;
    const totalTTC = unitTTC * (qteNum || 0);

    return {
      unitHT,
      discountAmt,
      fodecAmt,
      netHT,
      tvaAmt,
      unitTTC,
      totalTTC,
    };
  }, [form.qte, form.prixVHT, form.pourcentageRemise, form.pourcentageFodec, form.pourcentageTVA, selectedArticle]);

  // Form validation
  const isFormValid = useMemo(() => {
    // Check if article is selected
    if (!form.articleId || !articlesList.find(a => String(a.id) === String(form.articleId))) {
      return false;
    }

    // Check if quantity is valid
    const qty = Number(form.qte);
    if (!qty || qty <= 0) {
      return false;
    }

    // Check stock limits for products
    const selectedArt = articlesList.find(a => String(a.id) === String(form.articleId));
    if (selectedArt && selectedArt.typeArticle === 'product' && selectedArt.qteEnStock != null) {
      if (qty > Number(selectedArt.qteEnStock)) {
        return false;
      }
    }

    // Check if price is valid
    const price = form.prixVHT !== '' ? Number(form.prixVHT) : (selectedArt?.prixVenteHT ?? 0);
    if (!price || price <= 0) {
      return false;
    }

    // Check if total TTC is valid
    if (!computed.totalTTC || computed.totalTTC <= 0) {
      return false;
    }

    // No validation errors
    if (articleIdError) {
      return false;
    }

    return true;
  }, [form.articleId, form.qte, form.prixVHT, computed.totalTTC, articleIdError, articlesList, selectedArticle]);

  const submitForm = async () => {
    setSubmitError(null);
    if (!form.articleId || !articlesList.find(a => String(a.id) === String(form.articleId))) {
      setArticleIdError('Please select a valid article');
      return;
    }
    const a = articlesList.find(x => String(x.id) === String(form.articleId));
    const requestedQty = Number(form.qte) || 0;
    if (a && a.typeArticle === 'product' && a.qteEnStock != null && requestedQty > Number(a.qteEnStock)) {
      setArticleIdError(`Quantity exceeds available stock (${a.qteEnStock})`);
      return;
    }
    const prixVHTVal = form.prixVHT !== '' ? Number(form.prixVHT) : (selectedArticle?.prixVenteHT ?? 0);
    const pourcentageRemiseVal = form.pourcentageRemise !== '' ? Number(form.pourcentageRemise) : (selectedArticle?.pourcentageMaxRemise ?? undefined);
    const remiseVal = computed.discountAmt;
    const pourcentageFodecVal = form.pourcentageFodec !== '' ? Number(form.pourcentageFodec) : (selectedArticle?.pourcentageFODEC ?? undefined);
    const fodecVal = computed.fodecAmt;
    const pourcentageTVAVal = form.pourcentageTVA !== '' ? Number(form.pourcentageTVA) : (selectedArticle?.pourcentageTVA ?? undefined);
    const tvaVal = computed.tvaAmt;
    const ttcVal = computed.totalTTC;

    const payload = {
      articleId: Number(form.articleId),
      qte: Number(form.qte),
      prixVHT: prixVHTVal,
      pourcentageRemise: pourcentageRemiseVal,
      remise: remiseVal,
      pourcentageFodec: pourcentageFodecVal,
      fodec: fodecVal,
      pourcentageTVA: pourcentageTVAVal,
      tva: tvaVal,
      ttc: ttcVal,
      type: form.type,
    };

    if (!payload.qte || payload.qte <= 0) {
      setSubmitError('Quantity must be greater than 0.');
      return;
    }
    if (!payload.ttc || payload.ttc <= 0) {
      setSubmitError('Total TTC must be greater than 0.');
      return;
    }

    const isEdit = Boolean(editing);
    const url = isEdit ? '/api/dashboard/operations/sales/orders/update' : '/api/dashboard/operations/sales/orders/create';
    const method = isEdit ? 'PUT' : 'POST';
    const body = isEdit ? { id: editing!.id, ...payload } : payload;

    try {
      if (isEdit) {
        await updateOrder.mutateAsync(body as any);
      } else {
        await createOrder.mutateAsync(body);
      }
       closeModal();
    } catch (e: any) {
      const msg = String(e?.message || '').toLowerCase();
      let friendly = 'Something went wrong while saving the order. Please try again.';
      if (msg.includes('validation error')) {
        friendly = 'Please check the entered values and try again.';
      } else if (msg.includes('exceeds available stock')) {
        friendly = 'Quantity exceeds available stock for the selected article.';
      } else if (msg.includes('business not found')) {
        friendly = 'Your business context could not be found.';
      } else if (msg.includes('failed to create order')) {
        friendly = 'Failed to create the order. Please try again.';
      } else if (msg.includes('failed to update order')) {
        friendly = 'Failed to update the order. Please try again.';
      } else if (msg.includes('internal server error') || msg.match(/\(500\)/)) {
        friendly = 'Unexpected server error. Please try again later.';
      }
      setSubmitError(friendly);
    }
  };

  const deleteOrder = async (order: OrderItem) => {
    if (!confirm('Delete this order?')) return;
    try {
      await deleteOrderMutation.mutateAsync(order.id);
    } catch (e: any) {
      alert(e?.message || 'Failed to delete order');
    }
  };

  return (
    <div className="w-full max-w-none px-4 pt-4 space-y-6">
      {/* Sticky top tab navigation */}
      <div className="sticky top-0 z-40 -mx-4 px-4 pt-1 pb-3 bg-white/70 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center gap-2 overflow-x-auto">
          {([
            { key: 'all', label: 'All' },
            { key: 'order', label: 'Orders' },
            { key: 'delivery', label: 'Deliveries' },
            { key: 'invoice', label: 'Invoices' },
            { key: 'returns', label: 'Returns' },
          ] as { key: 'all' | 'order' | 'delivery' | 'invoice' | 'returns'; label: string }[]).map(tab => {
            const isActive = activeSection === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveSection(tab.key); setCurrentPage(1); }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-[#3c959d] to-[#ef7335] text-white border-transparent shadow'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#3c959d]'
                }`}
                title={`${tab.label} section`}
              >
                <span>{tab.label}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                  isActive ? 'bg-white/25' : 'bg-gray-100 text-gray-700'
                }`}>
                  {sectionCounts[tab.key]}
                </span>
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by article or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white/80 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]"
              />
              <button
                onClick={() => { setCurrentPage(1); ordersQuery.refetch(); }}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-[#3c959d]"
                title="Search"
              >
                <Icon icon="solar:magnifer-linear" width={16} height={16} />
              </button>
            </div>
            <button
              onClick={openCreate}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3c959d] to-[#ef7335] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <Icon icon="solar:add-circle-bold-duotone" width={16} height={16} />
              New {activeSection === 'all' ? 'Order' : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 flex items-center justify-center">
              <Icon icon="solar:cart-3-bold-duotone" className="text-[#3c959d]" width={20} height={20} />
            </span>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Sales Orders</h3>
              <p className="text-sm text-gray-600">Create and manage confirmed customer orders</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {activeSection === 'all' ? (
              <span>Total: {sectionCounts.all}</span>
            ) : (
              <span>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}: {sectionCounts[activeSection]} of {sectionCounts.all}</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Article</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price HT</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">VAT %</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">TTC</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center">
                    <LoadingSpinner 
                      icon={ShoppingCart}
                      message="Loading orders..."
                      variant="default"
                      size="md"
                    />
                  </td>
                </tr>
              ) : error ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-red-600">{error}</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500">No orders found</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3 text-sm text-gray-700">#{order.id}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.type === 'order' ? 'bg-blue-100 text-blue-800' :
                        order.type === 'delivery' ? 'bg-green-100 text-green-800' :
                        order.type === 'invoice' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.type.charAt(0).toUpperCase() + order.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{order.article?.article || '—'}</span>
                        {order.article?.marque && (
                          <span className="text-gray-500">({order.article.marque})</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">{order.qte}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">${Number(order.prixVHT).toFixed(2)}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{order.pourcentageTVA ?? 0}%</td>
                    <td className="px-6 py-3 text-sm text-gray-700">${Number(order.ttc).toFixed(2)}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(order)}
                          className="p-2 text-[#3c959d] hover:bg-[#3c959d]/10 rounded-lg transition-colors"
                          title="Edit order"
                        >
                          <Icon icon="solar:pen-bold-duotone" width={16} height={16} />
                        </button>
                        <button
                          onClick={() => deleteOrder(order)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete order"
                        >
                          <Icon icon="solar:trash-bin-trash-bold-duotone" width={16} height={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="bg-gray-50/80 border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                {pagination.totalItems} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-3 py-2 text-sm font-medium text-gray-700">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-4xl max-h-[85vh] overflow-y-auto border border-gray-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#3c959d] to-[#ef7335] flex items-center justify-center">
                  <Icon icon="solar:cart-3-bold-duotone" className="text-white" width={20} height={20} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{editing ? 'Edit Order' : 'Create Order'}</h3>
                  <p className="text-xs text-gray-500">Fill the order details below</p>
                </div>
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700" onClick={closeModal}>
                <Icon icon="solar:close-circle-bold" width={18} height={18} />
              </button>
            </div>
            {submitError && (
              <div className="px-6 pt-3">
                <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm p-3">
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:danger-circle-bold-duotone" width={16} height={16} />
                    <span>{submitError}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Article</label>
                <div className="flex gap-2">
                  <select
                    value={selectedArticle ? String(selectedArticle.id) : ''}
                    onChange={(e) => {
                      const id = e.target.value;
                      const a = articlesList.find(x => String(x.id) === String(id));
                      setForm(prev => {
                        // Smart quantity handling based on article type
                        let newQty = prev.qte;
                        
                        // If switching to a product with stock management, ensure quantity doesn't exceed stock
                        if (a && a.typeArticle === 'product' && a.qteEnStock != null) {
                          const currentQty = Number(prev.qte) || 0;
                          const maxStock = Number(a.qteEnStock);
                          newQty = String(Math.max(0, Math.min(currentQty, maxStock)));
                        } else if (a && a.typeArticle === 'service') {
                          // For services, keep current quantity or default to 0
                          newQty = prev.qte || '0';
                        } else {
                          // For other cases, default to 0
                          newQty = '0';
                        }
                        
                        return {
                          ...prev,
                          articleId: id,
                          qte: newQty,
                          // Prefill price and VAT if present on article
                          prixVHT: a?.prixVenteHT != null ? String(a.prixVenteHT) : prev.prixVHT,
                          pourcentageTVA: a?.pourcentageTVA != null ? String(a.pourcentageTVA) : prev.pourcentageTVA,
                        };
                      });
                      // Clear any previous errors when switching products
                      setArticleIdError(null);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d] bg-white"
                  >
                    <option value="">Select article by name</option>
                    {isArticlesLoading && (
                      <option disabled>Loading articles...</option>
                    )}
                    {articlesError && !isArticlesLoading && (
                      <option disabled>Failed to load articles</option>
                    )}
                    {!isArticlesLoading && !articlesError && articlesList.length === 0 && (
                      <option disabled>No articles found</option>
                    )}
                    {!isArticlesLoading && !articlesError && articlesList.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}{a.marque ? ` (${a.marque})` : ''}</option>
                    ))}
                  </select>
                <input
                  type="number"
                  name="articleId"
                  value={form.articleId}
                  onChange={handleChange}
                    className="w-28 px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]"
                    placeholder="ID"
                  />
                </div>
                <div className="mt-1 min-h-[20px] text-xs">
                  {selectedArticle && !articleIdError && (
                    <span className="text-gray-600">Selected: {selectedArticle.name}{selectedArticle.marque ? ` (${selectedArticle.marque})` : ''} · Stock: {selectedArticle.qteEnStock ?? 0}</span>
                  )}
                  {articleIdError && (
                    <span className="text-red-600">{articleIdError}</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value as 'order' | 'delivery' | 'invoice' | 'returns' }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d] bg-white"
                >
                  <option value="order">Order</option>
                  <option value="delivery">Delivery</option>
                  <option value="invoice">Invoice</option>
                  <option value="returns">Returns</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  name="qte"
                  value={form.qte}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border focus:ring-1 transition-colors ${
                    articleIdError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-200 focus:border-[#3c959d] focus:ring-[#3c959d]'
                  }`}
                  min={0}
                  max={selectedArticle && selectedArticle.typeArticle === 'product' && selectedArticle.qteEnStock != null ? Number(selectedArticle.qteEnStock) : undefined}
                />
                {selectedArticle && (
                  <div className="mt-1 text-xs">
                    {selectedArticle.typeArticle === 'product' && selectedArticle.qteEnStock != null ? (
                      <span className="text-gray-500">
                        Available stock: <span className="font-medium">{selectedArticle.qteEnStock}</span>
                      </span>
                    ) : selectedArticle.typeArticle === 'service' ? (
                      <span className="text-blue-600">Service - No stock limit</span>
                    ) : (
                      <span className="text-gray-500">No stock management</span>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price HT</label>
                <input
                  type="number"
                  step="0.01"
                  name="prixVHT"
                  value={form.prixVHT}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]"
                  placeholder={selectedArticle?.prixVenteHT != null ? String(selectedArticle.prixVenteHT) : undefined}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                <input
                  type="number"
                  step="0.01"
                  name="pourcentageRemise"
                  value={form.pourcentageRemise}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]"
                  placeholder={selectedArticle?.pourcentageMaxRemise != null ? String(selectedArticle.pourcentageMaxRemise) : undefined}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Amount</label>
                <div className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 font-semibold">
                  {computed.discountAmt.toFixed(2)}
                </div>
                <p className="mt-1 text-xs text-gray-500">Calculated from discount percentage or fixed amount</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fodec %</label>
                <input
                  type="number"
                  step="0.01"
                  name="pourcentageFodec"
                  value={form.pourcentageFodec}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]"
                  placeholder={selectedArticle?.pourcentageFODEC != null ? String(selectedArticle.pourcentageFODEC) : undefined}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fodec Amount</label>
                <div className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 font-semibold">
                  {computed.fodecAmt.toFixed(2)}
                </div>
                <p className="mt-1 text-xs text-gray-500">Calculated from Fodec percentage or fixed amount</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VAT %</label>
                <input
                  type="number"
                  step="0.01"
                  name="pourcentageTVA"
                  value={form.pourcentageTVA}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]"
                  placeholder={selectedArticle?.pourcentageTVA != null ? String(selectedArticle.pourcentageTVA) : undefined}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VAT Amount</label>
                <div className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 font-semibold">
                  {computed.tvaAmt.toFixed(2)}
              </div>
                <p className="mt-1 text-xs text-gray-500">Calculated from VAT percentage or fixed amount</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Total TTC</label>
                <div className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 font-semibold">
                  {computed.totalTTC.toFixed(2)}
                </div>
                <p className="mt-1 text-xs text-gray-500">Calculated automatically based on quantity, price, discounts, and taxes</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100">
              <div className="flex items-center justify-end gap-3">
                <button onClick={closeModal} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button 
                  onClick={submitForm} 
                  disabled={!isFormValid}
                  className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isFormValid 
                      ? 'text-white bg-gradient-to-r from-[#3c959d] to-[#ef7335] hover:shadow-lg cursor-pointer' 
                      : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                  }`}
                >
                  {editing ? 'Save Changes' : 'Create Order'}
                </button>
              </div>
              {!isFormValid && (
                <div className="mt-3 text-xs text-gray-500 text-center">
                  Please fill all required fields correctly to create the order
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
