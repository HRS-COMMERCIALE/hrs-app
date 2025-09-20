'use client';

import React, { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';

type PurchaseItem = {
  id: number;
  type: 'order' | 'delivery' | 'invoice' | 'returns';
  qte: number;
  prixVHT: number;
  pourcentageTVA?: number | null;
  ttc: number;
  article?: { article?: string; marque?: string } | null;
};

export default function PurchasesPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [activeSection, setActiveSection] = useState<'all' | 'order' | 'delivery' | 'invoice' | 'returns'>('all');
  const [showModal, setShowModal] = useState<boolean>(false);

  // Front-end only scaffold data (replace with hooks when backend is ready)
  const purchases: PurchaseItem[] = useMemo(() => {
    return [];
  }, []);

  const sectionCounts = useMemo(() => {
    const base: Record<'all' | 'order' | 'delivery' | 'invoice' | 'returns', number> = {
      all: purchases.length,
      order: 0,
      delivery: 0,
      invoice: 0,
      returns: 0,
    };
    for (const p of purchases) {
      const key = p.type as 'order' | 'delivery' | 'invoice' | 'returns';
      if (key in base) base[key] += 1;
    }
    return base;
  }, [purchases]);

  const filteredPurchases = useMemo(() => {
    let list = purchases;
    if (activeSection !== 'all') list = list.filter(p => p.type === activeSection);
    if (search.trim()) {
      list = list.filter(p =>
        (p.article?.article || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.article?.marque || '').toLowerCase().includes(search.toLowerCase())
      );
    }
    return list;
  }, [purchases, activeSection, search]);

  const pagination = useMemo(() => {
    const totalItems = filteredPurchases.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const hasPrevPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;
    return { currentPage, totalPages, totalItems, itemsPerPage: limit, hasPrevPage, hasNextPage };
  }, [filteredPurchases.length, limit, currentPage]);

  const pageSlice = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredPurchases.slice(start, start + limit);
  }, [filteredPurchases, currentPage, limit]);

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
                onClick={() => { setCurrentPage(1); }}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-[#3c959d]"
                title="Search"
              >
                <Icon icon="solar:magnifer-linear" width={16} height={16} />
              </button>
            </div>
            <button
              onClick={() => setShowModal(true)}
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
              <Icon icon="solar:bag-smile-bold-duotone" className="text-[#3c959d]" width={20} height={20} />
            </span>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Purchases</h3>
              <p className="text-sm text-gray-600">Create and manage supplier purchases</p>
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
              {pageSlice.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500">No purchases found</td></tr>
              ) : (
                pageSlice.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3 text-sm text-gray-700">#{p.id}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.type === 'order' ? 'bg-blue-100 text-blue-800' :
                        p.type === 'delivery' ? 'bg-green-100 text-green-800' :
                        p.type === 'invoice' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {p.type.charAt(0).toUpperCase() + p.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{p.article?.article || '—'}</span>
                        {p.article?.marque && (
                          <span className="text-gray-500">({p.article.marque})</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">{p.qte}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">${Number(p.prixVHT).toFixed(2)}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{p.pourcentageTVA ?? 0}%</td>
                    <td className="px-6 py-3 text-sm text-gray-700">${Number(p.ttc).toFixed(2)}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-[#3c959d] hover:bg-[#3c959d]/10 rounded-lg transition-colors" title="Edit">
                          <Icon icon="solar:pen-bold-duotone" width={16} height={16} />
                        </button>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
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

        {pagination.totalPages > 1 && (
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
                  <Icon icon="solar:bag-smile-bold-duotone" className="text-white" width={20} height={20} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Create {activeSection === 'all' ? 'Order' : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h3>
                  <p className="text-xs text-gray-500">Front-end only preview</p>
                </div>
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>
                <Icon icon="solar:close-circle-bold" width={18} height={18} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Article</label>
                <input type="text" className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]" placeholder="Select or enter article" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
                <select className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d] bg-white" value={activeSection === 'all' ? 'order' : activeSection} onChange={() => {}}>
                  <option value="order">Order</option>
                  <option value="delivery">Delivery</option>
                  <option value="invoice">Invoice</option>
                  <option value="returns">Returns</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input type="number" className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]" defaultValue={0} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price HT</label>
                <input type="number" step="0.01" className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">VAT %</label>
                <input type="number" step="0.01" className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]" rows={3} placeholder="Optional" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100">
              <div className="flex items-center justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button className="px-6 py-2.5 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#3c959d] to-[#ef7335] hover:shadow-lg">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
