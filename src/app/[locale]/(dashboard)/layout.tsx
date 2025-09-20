'use client';

import { useAuth } from '@/store/authProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner/LoadingSpinner';

export default function DashboardRouteGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authState === 'notAuthenticated') {
      router.push('/login');
    }
  }, [authState, router]);

  // Show loading while checking auth
  if (authState === 'loading') {
    return <LoadingSpinner appName="HRS App" message="Authenticating..." />;
  }

  // Don't render anything if not authenticated (will redirect)
  if (authState === 'notAuthenticated') {
    return null;
  }

  // Only render dashboard content when authenticated
  return <>{children}</>;
}
