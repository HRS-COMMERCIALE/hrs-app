"use client";

import React from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

export type ClientRow = {
  id: number;
  name: string;
  type: string;
  email: string | null;
  phone1: string | null;
  phone2: string | null;
  phone3: string | null;
  address: string;
  codesPostauxId?: number;
};

export type PostalCode = { id: number; code: string; city: string };

type Props = {
  clients: ClientRow[];
  postalCodes: PostalCode[];
  onEdit: (c: ClientRow) => void;
  onDelete: (c: ClientRow) => void;
};

export function ClientTable({ clients, postalCodes, onEdit, onDelete }: Props) {
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-200/50 shadow-sm">
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-400/5 to-orange-400/5 rounded-full -translate-y-8 translate-x-8"></div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/80 border-b border-gray-200 sticky top-0 z-10">
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
          <tbody className="divide-y divide-gray-100">
            {clients.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-gradient-to-br from-emerald-100 to-orange-100 rounded-2xl">
                      <Icon icon="solar:users-group-two-rounded-bold-duotone" className="text-emerald-600" width={32} height={32} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-gray-900">No clients found</h3>
                      <p className="text-gray-600 text-sm">Try adjusting your search or filters</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              clients.map((c, idx) => {
                const pc = postalCodes.find((p) => p.id === c.codesPostauxId);
                return (
                  <tr key={c.id} className={`group transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-50/80`}>
                    <td className="pl-1 w-1">
                      <div className="h-full w-1 rounded-r group-hover:bg-gradient-to-b from-emerald-400/60 to-orange-400/60" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#3c959d]/15 to-[#ef7335]/15 flex items-center justify-center ring-1 ring-white shadow-sm">
                          <Icon icon="solar:user-bold-duotone" className="text-[#3c959d]" width={14} height={14} />
                        </span>
                        <span className="font-medium text-gray-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${
                        c.type === 'Central' ? 'bg-blue-50 text-blue-700 ring-blue-200' : 'bg-green-50 text-green-700 ring-green-200'
                      }`}>{c.type}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{c.email || '-'}</td>
                    <td className="px-6 py-4 text-gray-700">{c.phone1 || c.phone2 || c.phone3 || '-'}</td>
                    <td className="px-6 py-4 text-gray-700">{c.address}</td>
                    <td className="px-6 py-4 text-gray-700">{pc ? `${pc.code} - ${pc.city}` : '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onEdit(c)}
                          className="p-2 text-[#3c959d] hover:bg-[#3c959d]/10 rounded-lg transition-colors"
                          title="Edit client"
                        >
                          <Icon icon="solar:pen-bold-duotone" width={16} height={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onDelete(c)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete client"
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
  );
}

export default ClientTable;


