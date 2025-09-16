'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../store/authProvider';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, checkAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const paymentIntentId = searchParams.get('payment_intent');
    
    if (paymentIntentId) {
      // Verify payment status
      verifyPaymentStatus(paymentIntentId);
    } else {
      setError('No payment information found');
      setLoading(false);
    }

    // Auto-redirect to homepage after 10 seconds
    const autoRedirectTimer = setTimeout(() => {
      router.push('/?payment_success=true&plan=' + (paymentDetails?.planName || user?.plan || 'premium'));
    }, 10000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(autoRedirectTimer);
      clearInterval(countdownInterval);
    };
  }, [searchParams, paymentDetails, user, router]);

  const verifyPaymentStatus = async (paymentIntentId: string) => {
    try {
      const response = await fetch(`/api/auth/payment/verify?payment_intent=${paymentIntentId}`);
      const result = await response.json();

      if (result.ok && result.verified) {
        setPaymentDetails(result.transaction);
        // Refresh user data to get updated plan
        await checkAuth();
      } else {
        setError(result.error || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setError('Failed to verify payment status');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToHomepage = () => {
    // Redirect to homepage with success parameter to show popup
    router.push('/?payment_success=true&plan=' + (paymentDetails?.planName || user?.plan || 'premium'));
  };

  const handleContinueToDashboard = () => {
    router.push('/dashboard');
  };

  const handleViewPlans = () => {
    router.push('/businessPlans');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3c959d] via-[#4ba5ad] to-[#ef7335]">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3c959d]"></div>
            <span className="text-lg font-medium text-slate-700">Verifying your payment...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3c959d] via-[#4ba5ad] to-[#ef7335]">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-xl max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Payment Verification Failed</h1>
            <p className="text-slate-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Button 
                onClick={handleViewPlans}
                className="w-full bg-gradient-to-r from-[#3c959d] to-[#4ba5ad] hover:from-[#2a7a82] hover:to-[#3d94a0] text-white"
              >
                Back to Plans
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3c959d] via-[#4ba5ad] to-[#ef7335] p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-xl max-w-lg w-full">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Payment Successful!</h1>
          <p className="text-slate-600 mb-6">
            Thank you for your subscription. Your plan has been activated successfully.
          </p>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-slate-800 mb-3">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Plan:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {paymentDetails.planName}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Amount:</span>
                  <span className="font-medium">${paymentDetails.amount} {paymentDetails.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {paymentDetails.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Payment ID:</span>
                  <span className="font-mono text-xs text-slate-500">
                    {paymentDetails.stripePaymentIntentId?.slice(-8)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* User Plan Update */}
          {user && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-blue-800">
                  Your account has been upgraded to <strong>{user.plan}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleContinueToHomepage}
              className="w-full bg-gradient-to-r from-[#3c959d] to-[#4ba5ad] hover:from-[#2a7a82] hover:to-[#3d94a0] text-white"
            >
              Continue to Homepage
            </Button>
            <Button 
              variant="outline" 
              onClick={handleContinueToDashboard}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>

          {/* Auto-redirect info */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-center space-x-2 text-sm text-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Redirecting to homepage in {countdown} seconds...</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              You will receive a confirmation email shortly. If you have any questions, 
              please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
