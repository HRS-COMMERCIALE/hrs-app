'use client';

import { useState, useEffect, useRef } from 'react';
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
  const hasBackgroundValidatedRef = useRef(false);

  // simple in-memory cache per session
  const cacheRef = useRef<Map<number, { valid: boolean; isBanned: boolean }>>(
    new Map()
  );

  useEffect(() => {
    const validateBusinessAccess = async () => {
      try {
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

        // Serve from cache without blocking UI, then background revalidate
        const cached = cacheRef.current.get(businessIdNum);
        if (cached) {
          setIsValid(cached.valid);
          setIsBanned(cached.isBanned);
          setIsLoading(false);
        } else {
          // first time: show minimal loading only once
          setIsLoading(true);
        }

        // Background validation (or first validation)
        const doValidate = async () => {
          const response = await fetch(`/api/auth/BuinessUsers/validateAccess?businessId=${businessIdNum}`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });
          const data = await response.json();
          if (response.ok && data.success) {
            cacheRef.current.set(businessIdNum, {
              valid: true,
              isBanned: data.data.isBanned || false,
            });
            setIsValid(true);
            setIsBanned(data.data.isBanned || false);
            setIsLoading(false);
          } else {
            setError(data.message || 'Access denied: You do not have permission to access this business');
            setIsValid(false);
            setIsLoading(false);
            router.push('/');
          }
        };

        // avoid duplicate background calls on fast re-renders
        if (!hasBackgroundValidatedRef.current) {
          hasBackgroundValidatedRef.current = true;
          void doValidate();
          // reset flag after microtask so next businessId change can re-run
          setTimeout(() => {
            hasBackgroundValidatedRef.current = false;
          }, 0);
        }
      } catch (err) {
        console.error('Error validating business access:', err);
        setError('Failed to validate business access');
        setIsValid(false);
        // Redirect to home page on error
        router.push('/');
      } finally {
        // isLoading is controlled based on cache/validation outcome
      }
    };

    validateBusinessAccess();
    // only re-run when businessId actually changes
  }, [searchParams.get('businessId'), router]);

  return {
    isValid,
    isLoading,
    error,
    businessId,
    isBanned,
  };
}
