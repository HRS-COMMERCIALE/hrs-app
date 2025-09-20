'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserBusinesses, BusinessAssociation } from '../hooks/useUserBusinesses';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner/LoadingSpinner';

// Business context interface
interface BusinessContextType {
  selectedBusiness: BusinessAssociation | null;
  selectedBusinessId: number | null;
  userBusinesses: BusinessAssociation[];
  loading: boolean;
  error: string | null;
  switchBusiness: (businessId: number) => void;
  hasAccess: boolean;
  isBanned: boolean;
}

// Create business context
const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

// Business provider component
export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { businesses, loading, error, refetch } = useUserBusinesses();
  
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessAssociation | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  // Get businessId from URL params
  const businessIdParam = searchParams.get('businessId');
  const businessId = businessIdParam ? parseInt(businessIdParam) : null;

  // Validate business access using dedicated API
  useEffect(() => {
    if (loading) return;
    
    if (!businessId) {
      // No business selected, redirect to business selection
      router.push('/');
      return;
    }

    if (error) {
      // Error loading businesses, redirect to home
      router.push('/');
      return;
    }

    // Validate business access using dedicated API
    const validateBusinessAccess = async () => {
      try {
        const response = await fetch(`/api/auth/BuinessUsers/validateAccess?businessId=${businessId}`, {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // User has access to this business
          const business = businesses.find(b => b.business?.id === businessId);
          if (business) {
            setSelectedBusiness(business);
            setSelectedBusinessId(businessId);
            setHasAccess(true);
            setIsBanned(data.data.isBanned);
          } else {
            // Business not found in user's businesses, redirect to home
            router.push('/');
            return;
          }
        } else {
          // User doesn't have access to this business, redirect to home
          router.push('/');
          return;
        }
      } catch (err) {
        console.error('Error validating business access:', err);
        // Network error, redirect to home
        router.push('/');
        return;
      }
    };

    validateBusinessAccess();

  }, [businessId, businesses, loading, error, router]);

  // Switch to a different business
  const switchBusiness = (newBusinessId: number) => {
    router.push(`/dashboard?businessId=${newBusinessId}`);
  };

  // Don't render children if no business selected or user doesn't have access
  if (loading) {
    return <LoadingSpinner appName="HRS App" message="Loading business..." />;
  }

  if (!businessId || !hasAccess || isBanned) {
    return null; // Will redirect
  }

  const value: BusinessContextType = {
    selectedBusiness,
    selectedBusinessId,
    userBusinesses: businesses,
    loading,
    error,
    switchBusiness,
    hasAccess,
    isBanned,
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
}

// Hook to use business context
export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
