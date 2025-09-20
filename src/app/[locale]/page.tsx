'use client';

import { useAuth } from '@/store/authProvider';
import { useSearchParams } from 'next/navigation';
import { useLocale, useI18n } from '@/i18n/hooks';
import { useState, useEffect, Suspense } from 'react';
import Header from '@/components/layout/Header/Header';
import HeroSection from '@/components/pages/HomePage/HeroSection';
import BusinessSolutions from "@/components/pages/HomePage/BusinessSolutions"
import BusinessOption from "@/components/pages/HomePage/buinesssOption"
import Container from "@/components/pages/HomePage/container"
import Footer from "@/components/pages/HomePage/footer"
import PaymentSuccessPopup from '@/components/ui/PaymentSuccessPopup';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner/LoadingSpinner';

function HomeContent() {
  const { authState, user } = useAuth();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const { t } = useI18n();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Check for payment success parameters
  useEffect(() => {
    const paymentSuccess = searchParams.get('payment_success');
    const plan = searchParams.get('plan');
    
    if (paymentSuccess === 'true' && plan) {
      setShowSuccessPopup(true);
      // Clean up URL parameters
      window.history.replaceState({}, '', `/${locale}`);
    }
  }, [searchParams, locale]);

  // Show loading state while checking authentication
  if (authState === 'loading') {
    return <LoadingSpinner appName={t('common.appName')} message={t('common.loading')} />;
  }

  // Show home page with conditional content based on authentication
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Only show HeroSection and BusinessSolutions for non-authenticated users */}
        {authState === 'notAuthenticated' && (
          <>
            <HeroSection />
            <BusinessSolutions/>
            <Container/>
          </>
        )}
        
        {/* Show BusinessOption for authenticated users */}
        {authState === 'authenticated' && (
          <BusinessOption />
        )}
        
        <Footer/>
      </main>

      {/* Payment Success Popup */}
      {showSuccessPopup && (
        <PaymentSuccessPopup 
          planName={searchParams.get('plan') || user?.plan || 'Premium'}
          onClose={() => setShowSuccessPopup(false)}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

