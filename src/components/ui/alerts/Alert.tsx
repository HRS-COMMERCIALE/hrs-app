'use client';

import React from 'react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
  showIcon?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const alertStyles = {
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: 'text-green-500',
    iconPath: 'M5 13l4 4L19 7',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: 'text-red-500',
    iconPath: 'M6 18L18 6M6 6l12 12',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: 'text-yellow-500',
    iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z',
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: 'text-blue-500',
    iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
};

export default function Alert({
  type,
  title,
  message,
  onClose,
  className = '',
  showIcon = true,
  autoClose = false,
  autoCloseDelay = 5000,
}: AlertProps) {
  const styles = alertStyles[type];

  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose, autoCloseDelay]);

  return (
    <div
      className={`border rounded-md p-4 ${styles.container} ${className}`}
      role="alert"
    >
      <div className="flex">
        {showIcon && (
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
        )}
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          <div className="text-sm">{message}</div>
        </div>
        
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 ${styles.container} hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${type}-50 focus:ring-${type}-600`}
              >
                <span className="sr-only">Dismiss</span>
                <svg
                  className="h-5 w-5"
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
        )}
      </div>
    </div>
  );
}
