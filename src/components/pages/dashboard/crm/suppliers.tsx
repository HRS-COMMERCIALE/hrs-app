"use client";

import React, { useMemo, useState } from 'react';
import { useSuppliers, useCreateSupplier, useUpdateSupplier, useDeleteSupplier, Supplier } from '@/hooks/useSuppliers';
import { usePostalCodes, useCreatePostalCode } from '@/hooks/usePostalCodes';
import { useBusiness } from '@/store/businessProvider';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner/LoadingSpinner';
import { Truck } from 'lucide-react';

type FormState = {
  id?: number;
  name: string;
  type: string;
  taxId: string;
  registrationNumber: string;
  email: string;
  address: string;
  phone1: string | null;
  phone2: string | null;
  phone3: string | null;
  codesPostauxId?: number;
};

const emptyForm: FormState = {
  name: '',
  type: '',
  taxId: '',
  registrationNumber: '',
  email: '',
  address: '',
  phone1: null,
  phone2: null,
  phone3: null,
  codesPostauxId: undefined,
};

export default function Suppliers() {
  const { selectedBusinessId } = useBusiness();
  const { data: suppliers = [], isLoading, error } = useSuppliers();
  const { data: postalCodes = [], refetch: refetchPostalCodes } = usePostalCodes(selectedBusinessId);
  const createPostalCode = useCreatePostalCode();
  const createSupplier = useCreateSupplier();
  const updateSupplier = useUpdateSupplier();
  const deleteSupplier = useDeleteSupplier();

  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPostalModal, setShowPostalModal] = useState(false);
  const [postalForm, setPostalForm] = useState({ governorate: '', code: '', city: '', location: '' });
  const [postalErrors, setPostalErrors] = useState<Record<string, string>>({});
  const [isSubmittingPostal, setIsSubmittingPostal] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [search, setSearch] = useState('');
  const [exportOpen, setExportOpen] = useState(false);

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; supplier: Supplier | null }>({
    isOpen: false,
    supplier: null
  });
  
  const filtered = useMemo(() => {
    if (!search.trim()) return suppliers;
    const q = search.toLowerCase();
    return suppliers.filter((s) =>
      [s.name, s.type, s.email, s.taxId, s.registrationNumber, s.address]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [suppliers, search]);

  const buildSuppliersHtml = (autoPrint: boolean) => {
    const docTitle = 'Suppliers Directory';
    const dateStr = new Date().toLocaleString();
    const rows = filtered.map((s) => ({
      code: s.registrationNumber || '',
      name: s.name || '',
      tel1: s.phone1 || '',
      tel2: s.phone2 || '',
      fax: s.phone3 || '',
      email: s.email || '',
    }));

    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${docTitle}</title>
    <style>
      :root { --ink: #111827; --muted: #6b7280; --line: #e5e7eb; --line-soft: #f3f4f6; }
      * { box-sizing: border-box; }
      html, body { height: 100%; }
      body { font-family: Arial, Helvetica, sans-serif; color: var(--ink); margin: 20mm; }
      header { margin-bottom: 10mm; }
      .title { font-size: 18px; font-weight: 700; margin: 0; }
      .subtitle { font-size: 12px; color: var(--muted); margin-top: 2mm; }

      table { width: 100%; border-collapse: collapse; table-layout: fixed; }
      thead th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: #374151; border-bottom: 1px solid var(--line); padding: 6px 8px; }
      tbody td { font-size: 12px; border-bottom: 1px solid var(--line-soft); padding: 8px; vertical-align: top; word-break: break-word; }
      tbody tr:nth-child(even) { background: #fafafa; }
      tfoot td { font-size: 11px; color: var(--muted); padding: 8px; }
      .right { text-align: right; }

      th.code { width: 14%; }
      th.name { width: 26%; }
      th.tel { width: 12%; }
      th.fax { width: 12%; }
      th.email { width: 24%; }

      .footer-note { margin-top: 6mm; font-size: 11px; color: var(--muted); }

      thead { display: table-header-group; }
      tfoot { display: table-row-group; }
      tr { page-break-inside: avoid; }
      @page { margin: 16mm; }
      @media print { body { margin: 0; } }
    </style>
  </head>
  <body>
    <header>
      <div class="title">${docTitle}</div>
      <div class="subtitle">Generated: ${dateStr} • Total suppliers: ${rows.length}</div>
    </header>

    <table>
      <thead>
        <tr>
          <th class="code">Code</th>
          <th class="name">Name</th>
          <th class="tel">Tel 1</th>
          <th class="tel">Tel 2</th>
          <th class="fax">Fax</th>
          <th class="email">Email</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (r) => `
          <tr>
            <td>${escapeHtml(r.code)}</td>
            <td>${escapeHtml(r.name)}</td>
            <td>${escapeHtml(r.tel1)}</td>
            <td>${escapeHtml(r.tel2)}</td>
            <td>${escapeHtml(r.fax)}</td>
            <td>${escapeHtml(r.email)}</td>
          </tr>`
          )
          .join('')}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="6" class="right">End of report</td>
        </tr>
      </tfoot>
    </table>

    <div class="footer-note">This document is system-generated and intended for internal use.</div>

    <script>
      ${autoPrint ? 'window.onload = () => { window.print(); };' : ''}
    </script>
  </body>
  </html>`;
  };

  const openSuppliersPdf = () => {
    const html = buildSuppliersHtml(true);
    const win = window.open('', '_blank');
    if (win) {
      win.document.open();
      win.document.write(html);
      win.document.close();
    }
  };

  const previewSuppliersPdf = () => {
    const html = buildSuppliersHtml(false);
    const win = window.open('', '_blank');
    if (win) {
      win.document.open();
      win.document.write(html);
      win.document.close();
    }
  };

  const downloadSuppliersPdf = async () => {
    const rows = filtered.map((s) => [
      s.registrationNumber || '',
      s.name || '',
      s.phone1 || '',
      s.phone2 || '',
      s.phone3 || '',
      s.email || '',
    ]);

    try {
      const jsPdfModule = await import('jspdf');
      // @ts-ignore - autotable has no types by default
      const autoTable = (await import('jspdf-autotable')).default || (await import('jspdf-autotable'));
      const { jsPDF } = jsPdfModule as any;
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });

      const title = 'Suppliers Directory';
      const dateStr = new Date().toLocaleString();

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(title, 40, 40);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Generated: ${dateStr} • Total suppliers: ${rows.length}`, 40, 60);

      // @ts-ignore
      autoTable(doc, {
        startY: 80,
        head: [[ 'Code', 'Name', 'Tel 1', 'Tel 2', 'Fax', 'Email' ]],
        body: rows,
        styles: { font: 'helvetica', fontSize: 9, cellPadding: 6, overflow: 'linebreak' },
        headStyles: { fillColor: [245, 245, 245], textColor: 20, lineWidth: 0.5 },
        bodyStyles: { lineWidth: 0.25 },
        alternateRowStyles: { fillColor: [252, 252, 252] },
        columnStyles: {
          0: { cellWidth: 90 },
          1: { cellWidth: 150 },
          2: { cellWidth: 80 },
          3: { cellWidth: 80 },
          4: { cellWidth: 80 },
          5: { cellWidth: 150 },
        },
      });

      doc.save('suppliers.pdf');
    } catch (err) {
      alert('PDF generator not available. Opening print preview instead.');
      previewSuppliersPdf();
    }
  };

  function escapeHtml(value: string) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const startCreate = () => {
    setForm(emptyForm);
    setIsEditMode(false);
    setIsOpen(true);
  };

  const startEdit = (s: Supplier) => {
    setForm({
      id: s.id,
      name: s.name,
      type: s.type,
      taxId: s.taxId,
      registrationNumber: s.registrationNumber,
      email: s.email,
      address: s.address,
      phone1: s.phone1,
      phone2: s.phone2,
      phone3: s.phone3,
      codesPostauxId: s.codesPostauxId ?? undefined,
    });
    setIsEditMode(true);
    setIsOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: form.name.trim(),
        type: form.type.trim(),
        taxId: form.taxId.trim(),
        registrationNumber: form.registrationNumber.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        phone1: form.phone1 || null,
        phone2: form.phone2 || null,
        phone3: form.phone3 || null,
        codesPostauxId: form.codesPostauxId,
      };

      if (form.id) {
        await updateSupplier.mutateAsync({ id: form.id, ...payload });
      } else {
        await createSupplier.mutateAsync(payload);
      }
      setIsOpen(false);
    } catch (e: any) {
      alert(e?.message || 'Failed to save supplier');
    }
  };

  const handleDelete = async (supplier: Supplier) => {
    try {
      await deleteSupplier.mutateAsync(supplier.id);
      setDeleteConfirm({ isOpen: false, supplier: null });
    } catch (e: any) {
      alert(e?.message || 'Failed to delete supplier');
    }
  };

  const openDeleteConfirm = (supplier: Supplier) => {
    setDeleteConfirm({ isOpen: true, supplier });
  };

  const openPostalModal = () => {
    setPostalForm({ governorate: '', code: '', city: '', location: '' });
    setPostalErrors({});
    setShowPostalModal(true);
  };

  const validatePostal = (data: typeof postalForm) => {
    const errs: Record<string, string> = {};
    if (!data.governorate.trim()) errs.governorate = 'Governorate is required';
    if (!data.code.trim()) errs.code = 'Postal code is required';
    if (!data.city.trim()) errs.city = 'City is required';
    if (!data.location.trim()) errs.location = 'Location is required';
    setPostalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreatePostal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePostal(postalForm)) return;
    setIsSubmittingPostal(true);
    try {
      await createPostalCode.mutateAsync({
        governorate: postalForm.governorate.trim(),
        code: postalForm.code.trim(),
        city: postalForm.city.trim(),
        location: postalForm.location.trim(),
        businessId: selectedBusinessId as number,
      });
      await refetchPostalCodes();
      setShowPostalModal(false);
    } catch (e: any) {
      alert(e?.message || 'Failed to add postal code');
    } finally {
      setIsSubmittingPostal(false);
    }
  };

  const supplierTypeOptions = [
    { value: '', label: 'Select a type' },
    { value: 'Producer', label: 'Producer' },
    { value: 'Wholesaler', label: 'Wholesaler' },
    { value: 'Retailer', label: 'Retailer' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <div className="w-full max-w-none px-4 pt-4">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 flex items-center justify-center">
              <Icon icon="solar:hand-money-bold-duotone" className="text-[#3c959d]" width={20} height={20} />
            </span>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Supplier Management</h3>
              <p className="text-sm text-gray-600">Manage, search, and maintain your supplier directory</p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            <button
              onClick={startCreate}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#3c959d] to-[#ef7335] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <Icon icon="solar:add-circle-bold-duotone" width={16} height={16} />
              Add Supplier
            </button>
            <button
              onClick={() => setExportOpen((v) => !v)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors flex items-center gap-2"
              title="Export options"
            >
              <Icon icon="solar:document-bold-duotone" width={16} height={16} />
              Export
              <Icon icon="solar:alt-arrow-down-bold" width={14} height={14} />
            </button>
            {exportOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10">
                <button onClick={openSuppliersPdf} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                  <Icon icon="solar:printer-bold-duotone" width={14} height={14} />
                  Print now
                </button>
                <button onClick={previewSuppliersPdf} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                  <Icon icon="solar:document-text-bold-duotone" width={14} height={14} />
                  Open preview
                </button>
                <button onClick={downloadSuppliersPdf} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
                  <Icon icon="solar:download-bold-duotone" width={14} height={14} />
                  Download PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search and Count */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={16} height={16} />
            <input
              type="text"
              placeholder="Search by name, email, type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d] focus:bg-white transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="h-2 w-2 rounded-full bg-[#3c959d]"></span>
            {filtered.length} of {suppliers.length} suppliers
          </div>
        </div>
      </div>

      {/* Table / Content Section */}
      {isLoading ? (
        <div className="bg-white/80 rounded-2xl border border-gray-200 p-6">
          <LoadingSpinner 
            icon={Truck}
            message="Loading suppliers..."
            variant="default"
            size="md"
          />
        </div>
      ) : error ? (
        <div className="bg-white/80 rounded-2xl border border-red-200 p-6 text-center text-red-600">
          <Icon icon="solar:danger-circle-bold-duotone" className="mx-auto mb-2" width={24} height={24} />
          {error?.message || 'Failed to load suppliers'}
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Postal code</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <Icon icon="solar:hand-money-bold-duotone" className="mx-auto mb-2 text-gray-300" width={32} height={32} />
                        <p className="text-sm">No suppliers found</p>
                        {search && <p className="text-xs mt-1">Try adjusting your search terms</p>}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => {
                    const pc = postalCodes.find((p) => p.id === s.codesPostauxId);
                    return (
                      <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#3c959d]/15 to-[#ef7335]/15 flex items-center justify-center">
                              <Icon icon="solar:hand-money-bold-duotone" className="text-[#3c959d]" width={14} height={14} />
                            </span>
                            <span className="font-medium text-gray-900">{s.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            s.type === 'Producer' 
                              ? 'bg-green-100 text-green-800' 
                              : s.type === 'Wholesaler'
                              ? 'bg-blue-100 text-blue-800'
                              : s.type === 'Retailer'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {s.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{s.email}</td>
                        <td className="px-6 py-4 text-gray-700">{s.phone1 || s.phone2 || s.phone3 || '-'}</td>
                        <td className="px-6 py-4 text-gray-700">{s.address}</td>
                        <td className="px-6 py-4 text-gray-700">{pc ? `${pc.code} - ${pc.city}` : '-'}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => startEdit(s)}
                              className="p-2 text-[#3c959d] hover:bg-[#3c959d]/10 rounded-lg transition-colors"
                              title="Edit supplier"
                            >
                              <Icon icon="solar:pen-bold-duotone" width={16} height={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => openDeleteConfirm(s)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete supplier"
                            >
                              <Icon icon="solar:trash-bin-trash-bold-duotone" width={16} height={16} />
                            </motion.button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
      {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-2"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col border border-gray-200/50"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 p-6 border-b border-gray-100 rounded-t-3xl">
                <div className="absolute inset-0 bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-50"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#3c959d] to-[#ef7335] flex items-center justify-center shadow-lg">
                      <Icon icon="solar:hand-money-bold-duotone" className="text-white" width={24} height={24} />
            </div>
              <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Supplier' : 'Add New Supplier'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {isEditMode ? 'Update the supplier information below' : 'Complete the form below to add a new supplier'}
                      </p>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(false)} 
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white/80 transition-all duration-200 shadow-sm"
                  >
                    <Icon icon="solar:close-circle-bold" width={20} height={20} />
                  </motion.button>
                </div>
              </div>

              {/* Form Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <div className="flex items-center gap-3 pb-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 flex items-center justify-center">
                          <Icon icon="solar:hand-money-bold-duotone" className="text-[#3c959d]" width={16} height={16} />
                        </div>
                        <h4 className="text-base font-semibold text-gray-900">Basic Information</h4>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#3c959d]/30 via-gray-200 to-[#ef7335]/30"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-medium text-gray-700">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                          <input 
                            value={form.name} 
                            onChange={(e) => setForm({ ...form, name: e.target.value })} 
                            className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-[#3c959d]/50 hover:bg-white/70" 
                            placeholder="Enter supplier name"
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                        </div>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-medium text-gray-700">
                          Type <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                            className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none hover:border-[#3c959d]/50 hover:bg-white/70"
                >
                  {supplierTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                          <Icon icon="solar:alt-arrow-down-bold-duotone" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#3c959d] transition-colors duration-200" width={16} height={16} />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Business Information */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <div className="flex items-center gap-3 pb-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 flex items-center justify-center">
                          <Icon icon="solar:buildings-2-bold-duotone" className="text-[#3c959d]" width={16} height={16} />
                        </div>
                        <h4 className="text-base font-semibold text-gray-900">Business Information</h4>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#3c959d]/30 via-gray-200 to-[#ef7335]/30"></div>
              </div>
              </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-medium text-gray-700">
                          Tax ID <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                          <input 
                            value={form.taxId} 
                            onChange={(e) => setForm({ ...form, taxId: e.target.value })} 
                            className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-[#3c959d]/50 hover:bg-white/70" 
                            placeholder="Tax ID"
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              </div>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-medium text-gray-700">
                          Registration Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                          <input 
                            value={form.registrationNumber} 
                            onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} 
                            className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-[#3c959d]/50 hover:bg-white/70" 
                            placeholder="Registration number"
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              </div>
                      </motion.div>
              </div>
                  </motion.div>

                  {/* Contact Information */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <div className="flex items-center gap-3 pb-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 flex items-center justify-center">
                          <Icon icon="solar:phone-bold-duotone" className="text-[#3c959d]" width={16} height={16} />
                        </div>
                        <h4 className="text-base font-semibold text-gray-900">Contact Information</h4>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#3c959d]/30 via-gray-200 to-[#ef7335]/30"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="md:col-span-2 space-y-2"
                      >
                        <label className="block text-sm font-medium text-gray-700">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                          <input 
                            type="email" 
                            value={form.email} 
                            onChange={(e) => setForm({ ...form, email: e.target.value })} 
                            className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-[#3c959d]/50 hover:bg-white/70" 
                            placeholder="supplier@example.com"
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                        </div>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                        className="md:col-span-2 space-y-2"
                      >
                        <label className="block text-sm font-medium text-gray-700">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                          <input 
                            value={form.address} 
                            onChange={(e) => setForm({ ...form, address: e.target.value })} 
                            className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-[#3c959d]/50 hover:bg-white/70" 
                            placeholder="Enter full address"
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                        </div>
                      </motion.div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-medium text-gray-700">Phone 1</label>
                        <div className="relative group">
                          <input 
                            value={form.phone1 ?? ''} 
                            onChange={(e) => setForm({ ...form, phone1: e.target.value || null })} 
                            className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-[#3c959d]/50 hover:bg-white/70" 
                            placeholder="Primary phone"
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                        </div>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-medium text-gray-700">Phone 2</label>
                        <div className="relative group">
                          <input 
                            value={form.phone2 ?? ''} 
                            onChange={(e) => setForm({ ...form, phone2: e.target.value || null })} 
                            className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-[#3c959d]/50 hover:bg-white/70" 
                            placeholder="Secondary phone"
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              </div>
                      </motion.div>
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-medium text-gray-700">Phone 3</label>
                        <div className="relative group">
                          <input 
                            value={form.phone3 ?? ''} 
                            onChange={(e) => setForm({ ...form, phone3: e.target.value || null })} 
                            className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm hover:border-[#3c959d]/50 hover:bg-white/70" 
                            placeholder="Additional phone"
                          />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
              </div>
                      </motion.div>
              </div>
                  </motion.div>

                  {/* Location Information */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <div className="flex items-center gap-3 pb-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 flex items-center justify-center">
                          <Icon icon="solar:map-point-bold-duotone" className="text-[#3c959d]" width={16} height={16} />
                        </div>
                        <h4 className="text-base font-semibold text-gray-900">Location Information</h4>
                        <div className="flex-1 h-px bg-gradient-to-r from-[#3c959d]/30 via-gray-200 to-[#ef7335]/30"></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                        <div className="relative group">
                <select
                            className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none hover:border-[#3c959d]/50 hover:bg-white/70"
                  value={form.codesPostauxId ?? ''}
                  onChange={(e) => setForm({ ...form, codesPostauxId: e.target.value ? Number(e.target.value) : undefined })}
                >
                  <option value="">Not linked</option>
                  {postalCodes.map((pc) => (
                    <option key={pc.id} value={pc.id}>{pc.code} - {pc.city}</option>
                  ))}
                </select>
                          <Icon icon="solar:alt-arrow-down-bold-duotone" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#3c959d] transition-colors duration-200" width={16} height={16} />
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="button" 
                          onClick={openPostalModal} 
                          className="text-xs text-[#3c959d] hover:text-[#ef7335] transition-colors font-medium"
                        >
                          + Add postal code
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
            </div>

              {/* Footer */}
              <div className="relative bg-gradient-to-r from-gray-50/80 to-gray-100/80 p-4 border-t border-gray-200/50 flex-shrink-0 rounded-b-3xl">
                <div className="flex items-center justify-between w-full">
                  <div className="text-xs text-gray-500">
                    * Required fields
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsOpen(false)} 
                      className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm whitespace-nowrap"
                    >
                      Cancel
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave} 
                      className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#3c959d] to-[#ef7335] rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2 shadow-lg whitespace-nowrap"
                    >
                      <Icon icon="solar:check-circle-bold-duotone" width={14} height={14} />
                      {isEditMode ? 'Update Supplier' : 'Save Supplier'}
                    </motion.button>
            </div>
          </div>
        </div>
            </motion.div>
          </motion.div>
      )}
      </AnimatePresence>
      {/* Add Postal Code Modal */}
      {showPostalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Postal Code</h3>
              <button onClick={() => setShowPostalModal(false)} className="text-gray-400 hover:text-gray-600">
                <Icon icon="solar:close-circle-bold" width={24} height={24} />
              </button>
            </div>
            <form onSubmit={handleCreatePostal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Governorate</label>
                <input
                  value={postalForm.governorate}
                  onChange={(e) => setPostalForm({ ...postalForm, governorate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]/20"
                />
                {postalErrors.governorate && (
                  <p className="mt-1 text-xs text-red-600">{postalErrors.governorate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                  value={postalForm.code}
                  onChange={(e) => setPostalForm({ ...postalForm, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]/20"
                />
                {postalErrors.code && (
                  <p className="mt-1 text-xs text-red-600">{postalErrors.code}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  value={postalForm.city}
                  onChange={(e) => setPostalForm({ ...postalForm, city: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]/20"
                />
                {postalErrors.city && (
                  <p className="mt-1 text-xs text-red-600">{postalErrors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  value={postalForm.location}
                  onChange={(e) => setPostalForm({ ...postalForm, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]/20"
                />
                {postalErrors.location && (
                  <p className="mt-1 text-xs text-red-600">{postalErrors.location}</p>
                )}
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostalModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPostal}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#3c959d] to-[#ef7335] text-white font-medium disabled:opacity-50"
                >
                  {isSubmittingPostal ? 'Adding...' : 'Add Postal Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.isOpen && deleteConfirm.supplier && (
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
                    <h3 className="text-lg font-semibold text-gray-900">Delete Supplier</h3>
                    <p className="text-sm text-gray-600">This action cannot be undone</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-gray-700">
                    Are you sure you want to delete <span className="font-semibold">{deleteConfirm.supplier.name}</span>?
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    All associated data will be permanently removed.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeleteConfirm({ isOpen: false, supplier: null })}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDelete(deleteConfirm.supplier!)}
                    disabled={deleteSupplier.isPending}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {deleteSupplier.isPending ? (
                      <>
                        <Icon icon="solar:loading-bold-duotone" className="animate-spin" width={16} height={16} />
                        Deleting...
                      </>
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


