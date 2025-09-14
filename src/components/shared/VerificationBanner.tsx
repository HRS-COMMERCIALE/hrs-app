'use client';

import { useAuth } from '@/store/authProvider';
import { useRouter } from 'next/navigation';

export function VerificationBanner() {
  const { user, authState } = useAuth();
  const router = useRouter();
  
  if (authState !== 'authenticated' || user?.emailVerified) {
    return null;
  }

  const handleVerifyEmail = () => {
    router.push('/verify-email');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-4 shadow-lg z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium">Email verification required</p>
            <p className="text-xs opacity-90">Please verify your email address to access all features</p>
          </div>
        </div>
        <button
          onClick={handleVerifyEmail}
          className="flex-shrink-0 bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors duration-200 shadow-sm"
        >
          Verify Email
        </button>
      </div>
    </div>
  );
}
