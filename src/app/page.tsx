'use client';

import { useAuth } from '@/store/authProvider';
import Header from '@/components/layout/Header/Header';
import HeroSection from '@/components/pages/HomePage/HeroSection';
import BusinessSolutions from "@/components/pages/HomePage/BusinessSolutions"
import BusinessOption from "@/components/pages/HomePage/buinesssOption"
import Container from "@/components/pages/HomePage/container"
import Footer from "@/components/pages/HomePage/footer"

export default function Home() {
  const { authState } = useAuth();

  // Show loading state while checking authentication
  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3c959d]"></div>
      </div>
    );
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
    </div>
  );
}