'use client';

import React from 'react';
import DashboardSidebar from '@/components/layout/Sidebar/DashboardSidebar';
import { BusinessProvider } from '@/store/businessProvider';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useBusinessAccessValidation } from '@/hooks/useBusinessAccessValidation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner/LoadingSpinner';
import { Icon } from '@iconify/react';

// Business validation wrapper component
function BusinessValidationWrapper({ children }: { children: React.ReactNode }) {
  const { isValid, isLoading, error, businessId, isBanned } = useBusinessAccessValidation();

  // Only show access denied if validation is complete and access is truly denied
  if (!isLoading && isValid === false) {
    return (
      <div className="flex h-screen bg-background">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Icon icon="solar:shield-cross-bold-duotone" className="h-16 w-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
            <p className="text-muted-foreground max-w-md">
              {error || 'You do not have permission to access this business.'}
            </p>
            {businessId && (
              <p className="text-sm text-muted-foreground">
                Business ID: {businessId}
              </p>
            )}
            {isBanned && (
              <p className="text-sm text-destructive font-medium">
                Your access to this business has been suspended.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render the dashboard with loading state integrated
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
          </header>
          <main className="flex-1 overflow-auto p-6">
            {isLoading || isValid === null ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <Icon icon="solar:loading-bold-duotone" className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Validating business access...</p>
                </div>
              </div>
            ) : isValid === true ? (
              children
            ) : null}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BusinessProvider>
      <BusinessValidationWrapper>
        {children}
      </BusinessValidationWrapper>
    </BusinessProvider>
  );
}

