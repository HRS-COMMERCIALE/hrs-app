import { useState, useEffect } from 'react';

export interface BusinessAssociation {
  associationId: number;
  role: 'member' | 'manager' | 'admin';
  status: 'active' | 'pending' | 'banned' | 'inactive';
  isOnline: boolean;
  isBanned: boolean;
  joinedAt: string | null;
  lastActiveAt: string | null;
  business: {
    id: number;
    businessName: string;
    logoFile: string | null;
    currency: string;
    industry: string;
    size: string;
    website: string | null;
    registrationNumber: string | null;
    taxId: string;
    cnssCode: string;
  } | null;
}

export interface BusinessDetails extends BusinessAssociation {
  business: {
    id: number;
    businessName: string;
    logoFile: string | null;
    currency: string;
    industry: string;
    size: string;
    website: string | null;
    registrationNumber: string | null;
    taxId: string;
    cnssCode: string;
    addresses: Array<{
      id: number;
      country: string;
      governorate: string;
      postalCode: string;
      address: string;
      phone: string;
      createdAt: string;
    }>;
  } | null;
}

export interface UseUserBusinessesReturn {
  businesses: BusinessAssociation[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserBusinesses(): UseUserBusinessesReturn {
  const [businesses, setBusinesses] = useState<BusinessAssociation[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/BuinessUsers/getAll');
      const data = await response.json();

      if (response.ok) {
        setBusinesses(data.data.businesses || []);
        setTotalCount(data.data.totalCount || 0);
      } else {
        setError(data.message || 'Failed to fetch businesses');
        setBusinesses([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Error fetching user businesses:', err);
      setError('Network error while fetching businesses');
      setBusinesses([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  return {
    businesses,
    totalCount,
    loading,
    error,
    refetch: fetchBusinesses
  };
}

export interface UseBusinessDetailsReturn {
  business: BusinessDetails | null;
  loading: boolean;
  error: string | null;
  fetchBusiness: (businessId: number) => Promise<void>;
}

export function useBusinessDetails(): UseBusinessDetailsReturn {
  const [business, setBusiness] = useState<BusinessDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBusiness = async (businessId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/auth/BuinessUsers/getOne?businessId=${businessId}`);
      const data = await response.json();

      if (response.ok) {
        setBusiness(data.data);
      } else {
        setError(data.message || 'Failed to fetch business details');
        setBusiness(null);
      }
    } catch (err) {
      console.error('Error fetching business details:', err);
      setError('Network error while fetching business details');
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    business,
    loading,
    error,
    fetchBusiness
  };
}
