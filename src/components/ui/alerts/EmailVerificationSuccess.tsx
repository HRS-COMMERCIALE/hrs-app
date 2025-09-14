import React from 'react';

interface EmailVerificationSuccessProps {
  onClose?: () => void;
  className?: string;
  showRedirectMessage?: boolean;
}

export default function EmailVerificationSuccess({
  onClose,
  className = '',
  showRedirectMessage = true,
}: EmailVerificationSuccessProps) {
  return (
    <div className={`max-w-md w-full space-y-8 p-8 ${className}`}>
      <div className="text-center">
        <div className="mx-auto h-12 w-12 text-green-500">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Email Verified!
        </h2>
        {showRedirectMessage && (
          <p className="mt-2 text-sm text-gray-600">
            Redirecting to Home page...
          </p>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            Continue to Home page
          </button>
        )}
      </div>
    </div>
  );
}
