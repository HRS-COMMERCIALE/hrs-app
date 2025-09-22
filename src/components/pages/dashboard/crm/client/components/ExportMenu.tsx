"use client";

import React from 'react';
import { Icon } from '@iconify/react';

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  onPrintNow: () => void;
  onOpenPreview: () => void;
  onDownloadPdf: () => void;
};

export default function ExportMenu({ isOpen, onToggle, onPrintNow, onOpenPreview, onDownloadPdf }: Props) {
  return (
    <div className="flex items-center gap-3 relative">
      <button
        onClick={onToggle}
        className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white/90 hover:bg-white text-gray-700 font-medium transition-colors flex items-center gap-2 shadow-sm"
        title="Export options"
      >
        <Icon icon="solar:document-bold-duotone" width={16} height={16} />
        Export
        <Icon icon="solar:alt-arrow-down-bold" width={14} height={14} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-10">
          <button onClick={onPrintNow} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
            <Icon icon="solar:printer-bold-duotone" width={14} height={14} />
            Print now
          </button>
          <button onClick={onOpenPreview} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
            <Icon icon="solar:document-text-bold-duotone" width={14} height={14} />
            Open preview
          </button>
          <button onClick={onDownloadPdf} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2">
            <Icon icon="solar:download-bold-duotone" width={14} height={14} />
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}


