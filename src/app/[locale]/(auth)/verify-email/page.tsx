'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/alerts';
import { EmailVerificationSuccess } from '@/components/ui/alerts';
import { useAuth } from '@/store/authProvider';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner/LoadingSpinner';

interface VerificationResponse {
  success: boolean;
  message: string;
  error?: string;
  data?: {
    userId: number;
    expiresIn: number;
    emailSent?: boolean;
    emailDeliveryFailed?: boolean;
    emailVerified?: boolean;
  };
}

export default function VerifyEmailPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { updateEmailVerification } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Rate limiting state
  const [canSendCode, setCanSendCode] = useState(true);
  const [sendCodeCountdown, setSendCodeCountdown] = useState(0);

  // Maximum attempts and rate limiting
  const MAX_ATTEMPTS = 5;
  const SEND_CODE_COOLDOWN = 60; // 60 seconds
  const VERIFY_COOLDOWN = 30; // 30 seconds

  useEffect(() => {
    // Check if user is already verified and send verification code if needed
    const initializePage = async () => {
      await checkVerificationStatus();
      
      // If user is authenticated but not verified, automatically send verification code
      if (!isVerified) {
        await sendVerificationCode(true); // Pass true for automatic call
      }
    };
    
    initializePage();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sendCodeCountdown > 0) {
      timer = setTimeout(() => {
        setSendCodeCountdown(sendCodeCountdown - 1);
        if (sendCodeCountdown - 1 === 0) {
          setCanSendCode(true);
        }
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [sendCodeCountdown]);

  const checkVerificationStatus = async () => {
    try {
      setIsCheckingStatus(true);
      const response = await fetch('/api/auth/isAuthenticated');
      const data = await response.json();
      
      if (data.authenticated && data.user?.emailVerified) {
        setIsVerified(true);
        showToast('info', 'Your email is already verified! Redirecting to Home page...');
        setTimeout(() => router.push('/'), 2000);
        return; // Exit early
      }
      
      // If user is not authenticated, redirect to login
      if (!data.authenticated) {
        showToast('error', 'Please log in to verify your email');
        setTimeout(() => router.push('/login'), 2000);
        return;
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
      showToast('error', 'Failed to check verification status');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const sendVerificationCode = async (isAutomatic: boolean = false) => {
    if ((!canSendCode || isSendingCode) && !isAutomatic) return;

    setIsSendingCode(true);
    
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: VerificationResponse = await response.json();

      if (data.success) {
        if (!isAutomatic) {
          showToast('success', 'Verification code sent to your email!');
        }
        setCountdown(600); // 10 minutes countdown
        
        // Only set cooldown for manual calls, not automatic ones
        if (!isAutomatic) {
          setCanSendCode(false);
          setSendCodeCountdown(SEND_CODE_COOLDOWN);
        }
      } else {
        // Check if the error is due to email already being verified
        if (data.error === 'Email already verified') {
          showToast('info', 'Your email is already verified! Redirecting to home page...');
          setIsVerified(true);
          setTimeout(() => router.push('/'), 2000);
        } else {
          showToast('error', data.message || 'Failed to send verification code');
        }
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      if (!isAutomatic) {
        showToast('error', 'Failed to send verification code. Please try again.');
      }
    } finally {
      setIsSendingCode(false);
    }
  };

  const verifyEmail = async () => {
    if (!verificationCode || verificationCode.length !== 6 || isLoading) return;

    if (attempts >= MAX_ATTEMPTS) {
      showToast('error', 'Too many attempts. Please wait before trying again.');
      return;
    }

    setIsLoading(true);
    setAttempts(prev => prev + 1);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationCode }),
      });

      const data = await response.json();

      if (data.success) {
        setIsVerified(true);
        // Update the email verification status in auth provider
        updateEmailVerification(true);
        showToast('success', 'Email verified successfully!');
        setTimeout(() => router.push('/'), 2000);
      } else {
        showToast('error', data.message || 'Verification failed');
        
        // Rate limiting for failed attempts
        if (attempts >= 3) {
          setCountdown(VERIFY_COOLDOWN);
        }
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      showToast('error', 'Failed to verify email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      verifyEmail();
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <EmailVerificationSuccess 
          onClose={() => router.push('/')}
        />
      </div>
    );
  }

  // Show loading state while checking verification status
  if (isCheckingStatus) {
    return (
      <LoadingSpinner appName="HRS App" message="Checking verification status..." />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Verification Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 text-blue-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Verify Your Email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {countdown > 0 
                ? 'We\'ve sent a verification code to your email address'
                : 'Enter the verification code sent to your email address'
              }
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {/* Verification Code Input */}
            <div>
              <label htmlFor="verification-code" className="sr-only">
                Verification Code
              </label>
              <div className="relative">
                <input
                  id="verification-code"
                  name="verification-code"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={handleCodeChange}
                  onKeyPress={handleKeyPress}
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Verify Button */}
            <div>
              <button
                onClick={verifyEmail}
                disabled={verificationCode.length !== 6 || isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </div>
                ) : (
                  'Verify Email'
                )}
              </button>
            </div>

            {/* Send Code Again Button */}
            <div className="text-center">
              <button
                onClick={() => sendVerificationCode(false)} // Pass false for manual call
                disabled={!canSendCode || isSendingCode}
                className="text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isSendingCode ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </div>
                ) : canSendCode ? (
                  'Send code again'
                ) : (
                  `Send code again in ${formatTime(sendCodeCountdown)}`
                )}
              </button>
            </div>

            {/* Status Information */}
            <div className="text-center space-y-2">
              {countdown > 0 && (
                <p className="text-sm text-gray-600">
                  Code expires in: {formatTime(countdown)}
                </p>
              )}
              
              {attempts > 0 && attempts < MAX_ATTEMPTS && (
                <p className="text-sm text-orange-600">
                  Attempts: {attempts}/{MAX_ATTEMPTS}
                </p>
              )}
              
              {attempts >= MAX_ATTEMPTS && (
                <p className="text-sm text-red-600">
                  Too many attempts. Please wait before trying again.
                </p>
              )}
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <button
                onClick={() => router.push('/login')}
                className="text-gray-600 hover:text-gray-500 text-sm"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
