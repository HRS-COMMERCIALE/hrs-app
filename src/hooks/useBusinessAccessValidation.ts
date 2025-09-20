'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface BusinessAccessValidationResult {
  isValid: boolean | null; // null = not validated yet, true = valid, false = invalid
  isLoading: boolean;
  error: string | null;
  businessId: number | null;
  isBanned: boolean;
}

export function useBusinessAccessValidation(): BusinessAccessValidationResult {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isValid, setIsValid] = useState<boolean | null>(null); // null = not validated yet
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<number | null>(null);
  const [isBanned, setIsBanned] = useState(false);

  useEffect(() => {
    const validateBusinessAccess = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get businessId from URL params
        const businessIdParam = searchParams.get('businessId');
        
        if (!businessIdParam) {
          setError('No business ID provided');
          setIsValid(false);
          setIsLoading(false);
          return;
        }

        const businessIdNum = parseInt(businessIdParam);
        if (isNaN(businessIdNum)) {
          setError('Invalid business ID format');
          setIsValid(false);
          setIsLoading(false);
          return;
        }

        setBusinessId(businessIdNum);

        // Call the validation API
        const response = await fetch(`/api/auth/BuinessUsers/validateAccess?businessId=${businessIdNum}`, {
          method: 'GET',
          credentials: 'include', // Include cookies for authentication
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // User has access to this business
          setIsValid(true);
          setIsBanned(data.data.isBanned || false);
        } else {
          // User doesn't have access to this business
          setError(data.message || 'Access denied: You do not have permission to access this business');
          setIsValid(false);
          // Redirect to home page
          router.push('/');
        }
      } catch (err) {
        console.error('Error validating business access:', err);
        setError('Failed to validate business access');
        setIsValid(false);
        // Redirect to home page on error
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    validateBusinessAccess();
  }, [searchParams, router]);

  return {
    isValid,
    isLoading,
    error,
    businessId,
    isBanned,
  };
}
