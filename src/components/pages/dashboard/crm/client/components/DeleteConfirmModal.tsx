"use client";

import React from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  isOpen: boolean;
  clientName: string;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmModal({ isOpen, clientName, isPending, onCancel, onConfirm }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
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
                  <h3 className="text-lg font-semibold text-gray-900">Delete Client</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">
                  Are you sure you want to delete <span className="font-semibold">{clientName}</span>?
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  All associated data will be permanently removed.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCancel}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  disabled={isPending}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isPending ? (
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
  );
}


