"use client";

import React from 'react';
import { Icon } from '@iconify/react';

type PostalForm = { governorate: string; code: string; city: string; location: string };

type Props = {
  isOpen: boolean;
  form: PostalForm;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onChange: (patch: Partial<PostalForm>) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function PostalCodeModal({ isOpen, form, errors, isSubmitting, onChange, onClose, onSubmit }: Props) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add Postal Code</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Icon icon="solar:close-circle-bold" width={24} height={24} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Governorate</label>
            <input
              value={form.governorate}
              onChange={(e) => onChange({ governorate: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]/20"
            />
            {errors.governorate && (
              <p className="mt-1 text-xs text-red-600">{errors.governorate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
            <input
              value={form.code}
              onChange={(e) => onChange({ code: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]/20"
            />
            {errors.code && (
              <p className="mt-1 text-xs text-red-600">{errors.code}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              value={form.city}
              onChange={(e) => onChange({ city: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]/20"
            />
            {errors.city && (
              <p className="mt-1 text-xs text-red-600">{errors.city}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              value={form.location}
              onChange={(e) => onChange({ location: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d]/20"
            />
            {errors.location && (
              <p className="mt-1 text-xs text-red-600">{errors.location}</p>
            )}
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#3c959d] to-[#ef7335] text-white font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Postal Code'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


