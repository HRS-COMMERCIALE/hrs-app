"use client";

import React from 'react';
import { motion } from 'framer-motion';

type Props = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
};

export default function PaginationBar({ currentPage, totalPages, totalItems, itemsPerPage, hasPrevPage, hasNextPage, onPageChange }: Props) {
  return (
    <div className="bg-gray-50/80 border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </motion.button>
          <span className="px-3 py-2 text-sm font-medium text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </motion.button>
        </div>
      </div>
    </div>
  );
}


