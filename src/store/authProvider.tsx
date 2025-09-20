'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Authentication states
type AuthState = 'loading' | 'authenticated' | 'notAuthenticated';

// Business interface
interface Business {
  id: number;
  businessName: string;
  logoFile: string | null;
  currency: string;
  industry: string;
  size: string;
}

// User interface
interface User {
  id: number;
  email: string;
  plan: string;
  planValidUntil: string | null;
  firstName: string;
  lastName: string;
  title: string;
  status: string;
  mobile: string;
  emailVerified: boolean;
}

// Auth context interface
interface AuthContextType {
  authState: AuthState;
  user: User | null;
  business: Business | null;
  businessCount: number;
  businessLimit: number;
  canCreateBusiness: boolean;
  isPaidPlan: boolean;
  checkAuth: () => Promise<void>;
  updateEmailVerification: (verified: boolean) => void;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [businessCount, setBusinessCount] = useState<number>(0);
  const [businessLimit, setBusinessLimit] = useState<number>(0);
  const [canCreateBusiness, setCanCreateBusiness] = useState<boolean>(false);

  // Check authentication status
  const checkAuth = async () => {
    try {
      setAuthState('loading');
      
      const response = await fetch('/api/auth/isAuthenticated');
      const data = await response.json();
      
      if (data.authenticated) {
        setAuthState('authenticated');
        setUser(data.user);
        setBusiness(data.business);
        setBusinessCount(data.businessCount ?? 0);
        
        // Calculate business limit and creation ability
        const plan = data.user?.plan;
        const count = data.businessCount ?? 0;
        
        let limit = 0;
        if (plan === 'free') limit = 0;
        else if (plan === 'Premium' || plan === 'Platinum') limit = 1;
        else if (plan === 'Diamond') limit = 3;
        
        setBusinessLimit(limit);
        setCanCreateBusiness(plan !== 'free' && plan !== 'custom' && count < limit);
      } else {
        setAuthState('notAuthenticated');
        setUser(null);
        setBusiness(null);
        setBusinessCount(0);
        setBusinessLimit(0);
        setCanCreateBusiness(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState('notAuthenticated');
      setUser(null);
      setBusiness(null);
      setBusinessCount(0);
      setBusinessLimit(0);
      setCanCreateBusiness(false);
    }
  };

  // Update email verification status
  const updateEmailVerification = (verified: boolean) => {
    if (user) {
      setUser({
        ...user,
        emailVerified: verified
      });
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    authState,
    user,
    business,
    businessCount,
    businessLimit,
    canCreateBusiness,
    isPaidPlan: !!user && user.plan !== 'free',
    checkAuth,
    updateEmailVerification,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
