"use client";

import React from 'react';
import { Icon } from '@iconify/react';
import type { GetClientsParams } from '@/hooks/useClients';

type Props = {
  filters: GetClientsParams;
  totalItems?: number;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: keyof GetClientsParams, value: string) => void;
};

export function ClientFilters({ filters, totalItems = 0, onSearchChange, onFilterChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className="h-2 w-2 rounded-full bg-[#3c959d]"></span>
          <span className="px-2 py-0.5 rounded-full bg-white/70 border border-gray-200">{totalItems} clients</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={16} height={16} />
          <input
            type="text"
            placeholder="Search by name, email, type..."
            value={filters.search || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 focus:bg-white transition-all text-sm shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <select
            value={filters.type || ''}
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 appearance-none shadow-sm"
          >
            <option value="">All Types</option>
            <option value="Central">Central</option>
            <option value="Branch">Branch</option>
          </select>
          <Icon icon="solar:alt-arrow-down-bold-duotone" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width={14} height={14} />
        </div>
        <div className="relative">
          <select
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 appearance-none shadow-sm"
          >
            <option value="">All Categories</option>
            <option value="State">State</option>
            <option value="Private">Private</option>
          </select>
          <Icon icon="solar:alt-arrow-down-bold-duotone" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width={14} height={14} />
        </div>
        <div className="relative">
          <select
            value={filters.governorate || ''}
            onChange={(e) => onFilterChange('governorate', e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm focus:border-[#3c959d] focus:ring-2 focus:ring-[#3c959d]/20 appearance-none shadow-sm"
          >
            <option value="">All Governorates</option>
            <option value="Ariana">Ariana</option>
            <option value="Béja">Béja</option>
            <option value="Ben Arous">Ben Arous</option>
            <option value="Bizerte">Bizerte</option>
            <option value="Gabès">Gabès</option>
            <option value="Gafsa">Gafsa</option>
            <option value="Jendouba">Jendouba</option>
            <option value="Kairouan">Kairouan</option>
            <option value="Kasserine">Kasserine</option>
            <option value="Kébili">Kébili</option>
            <option value="Kef">Kef</option>
            <option value="Mahdia">Mahdia</option>
            <option value="Manouba">Manouba</option>
            <option value="Médenine">Médenine</option>
            <option value="Monastir">Monastir</option>
            <option value="Nabeul">Nabeul</option>
            <option value="Sfax">Sfax</option>
            <option value="Sidi Bouzid">Sidi Bouzid</option>
            <option value="Siliana">Siliana</option>
            <option value="Sousse">Sousse</option>
            <option value="Tataouine">Tataouine</option>
            <option value="Tozeur">Tozeur</option>
            <option value="Tunis">Tunis</option>
            <option value="Zaghouan">Zaghouan</option>
          </select>
          <Icon icon="solar:alt-arrow-down-bold-duotone" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width={14} height={14} />
        </div>
      </div>

      {/* Quick chips */}
      <div className="mt-1 pt-3 border-t border-gray-200/60 flex flex-wrap gap-2">
        <button
          onClick={() => {
            onSearchChange('');
            onFilterChange('type', '');
            onFilterChange('category', '');
            onFilterChange('governorate', '');
          }}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            !filters.search && !filters.type && !filters.category && !filters.governorate
              ? 'bg-[#3c959d] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onFilterChange('type', 'Central')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            filters.type === 'Central' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Central
        </button>
        <button
          onClick={() => onFilterChange('type', 'Branch')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            filters.type === 'Branch' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Branch
        </button>
        <button
          onClick={() => onFilterChange('category', 'Private')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            filters.category === 'Private' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Private
        </button>
        <button
          onClick={() => onFilterChange('category', 'State')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            filters.category === 'State' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          State
        </button>
      </div>
    </div>
  );
}

export default ClientFilters;


