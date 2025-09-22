'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/alerts';
import { EmailVerificationSuccess } from '@/components/ui/alerts';
import { useAuth } from '@/store/authProvider';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  RefreshCw,
  Sparkles,
  Lock,
  
} from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <EmailVerificationSuccess 
          onClose={() => router.push('/')}
        />
      </div>
    );
  }

  // Show loading state while checking verification status
  if (isCheckingStatus) {
    return (
      <LoadingSpinner 
        icon={Mail}
        message="Checking verification status..."
        variant="fullscreen"
        size="lg"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-tilt"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzEwOF8xNzgpIj4KPHBhdGggZD0iTTQwIDEuNUgwVjBINDBWMS41WiIgZmlsbD0iIzMzMzMzMyIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMTA4XzE3OCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K')] opacity-20"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header Card */}
          <div className="mb-6 border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-lg">
            <div className="text-center p-6 pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg animate-float">
                <Mail className="w-8 h-8 text-white" />
            </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                Email Verification
            </h2>
              <p className="text-slate-600 text-sm">
              {countdown > 0 
                ? 'We\'ve sent a verification code to your email address'
                : 'Enter the verification code sent to your email address'
              }
            </p>
            </div>
          </div>

          {/* Main Verification Card */}
          <div className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-lg">
            <div className="p-8">
            {/* Verification Code Input */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="verification-code" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                Verification Code
              </label>
              <div className="relative">
                    <Input
                  id="verification-code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="\\d*"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={handleCodeChange}
                  onKeyPress={handleKeyPress}
                  maxLength={6}
                  disabled={isLoading}
                      className="text-center text-2xl tracking-widest font-mono h-14 border-2 focus:border-blue-500 focus:ring-blue-500/20"
                    />
              </div>
            </div>

            {/* Verify Button */}
                <Button
                onClick={verifyEmail}
                disabled={verificationCode.length !== 6 || isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    Verifying...
                  </div>
                ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Verify Email
                    </div>
                )}
                </Button>

                <Separator className="my-6" />

            {/* Send Code Again Button */}
            <div className="text-center">
                  <Button
                    onClick={() => sendVerificationCode(false)}
                disabled={!canSendCode || isSendingCode}
                    variant="outline"
                    className="w-full h-10 border-2 hover:bg-slate-50 disabled:opacity-50"
              >
                {isSendingCode ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                    Sending...
                  </div>
                ) : canSendCode ? (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Send code again
                      </div>
                ) : (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Send code again in {formatTime(sendCodeCountdown)}
                      </div>
                )}
                  </Button>
            </div>

            {/* Status Information */}
                <div className="space-y-3">
              {countdown > 0 && (
                    <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                  Code expires in: {formatTime(countdown)}
                      </span>
                    </div>
              )}
              
              {attempts > 0 && attempts < MAX_ATTEMPTS && (
                    <div className="flex items-center justify-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">
                  Attempts: {attempts}/{MAX_ATTEMPTS}
                      </span>
                    </div>
              )}
              
              {attempts >= MAX_ATTEMPTS && (
                    <div className="flex items-center justify-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">
                  Too many attempts. Please wait before trying again.
                      </span>
                    </div>
              )}
            </div>

            {/* Back to Login */}
                <div className="text-center pt-4">
                  <Button
                onClick={() => router.push('/login')}
                    variant="ghost"
                    className="text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="mt-6 border-0 shadow-lg bg-white/70 backdrop-blur-sm rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
