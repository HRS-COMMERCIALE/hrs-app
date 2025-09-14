'use client';

import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
  className?: string;
}

const toastStyles = {
  success: {
    container: 'bg-green-500 text-white border-green-600',
    icon: 'text-green-100',
    iconPath: 'M5 13l4 4L19 7',
  },
  error: {
    container: 'bg-red-500 text-white border-red-600',
    icon: 'text-red-100',
    iconPath: 'M6 18L18 6M6 6l12 12',
  },
  warning: {
    container: 'bg-yellow-500 text-white border-yellow-600',
    icon: 'text-yellow-100',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z',
  },
  info: {
    container: 'bg-blue-500 text-white border-blue-600',
    icon: 'text-blue-100',
    iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
};

export default function Toast({
  type,
  message,
  onClose,
  duration = 3000,
  className = '',
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const styles = toastStyles[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className={`min-w-80 max-w-sm rounded-lg shadow-lg border px-4 py-3 ${styles.container} ${className}`}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className={`h-5 w-5 ${styles.icon}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={styles.iconPath}
              />
            </svg>
          </div>
          
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          
          <div className="ml-auto pl-3">
            <button
              onClick={handleClose}
              className="inline-flex rounded-md p-1.5 hover:bg-white hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <span className="sr-only">Dismiss</span>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
