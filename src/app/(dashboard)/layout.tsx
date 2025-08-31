'use client';

import { useAuth } from '@/store/authProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (authState === 'notAuthenticated') {
    return null;
  }

  // Only render dashboard content when authenticated
  return <>{children}</>;
}
