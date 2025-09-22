'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useAuth } from '@/store/authProvider';
import { useBusiness } from '@/store/businessProvider';
import { useSidebar } from '@/components/ui/sidebar';


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Navigation data
const navigationData = [
  {
    title: "Operations",
    items: [
      {
        title: "Sales",
        url: "/dashboard/operations/sales",
        icon: "solar:cart-large-2-bold-duotone",
      },
      {
        title: "Purchases", 
        url: "/dashboard/operations/purchases",
        icon: "solar:bag-smile-bold-duotone",
      },
      {
        title: "Inventory",
        url: "/dashboard/operations/inventory", 
        icon: "solar:box-bold-duotone",
      },
    ],
  },
  {
    title: "CRM",
    items: [
      {
        title: "Clients",
        url: "/dashboard/crm/clients",
        icon: "solar:user-id-bold-duotone",
      },
      {
        title: "Suppliers",
        url: "/dashboard/crm/suppliers", 
        icon: "solar:users-group-two-rounded-bold-duotone",
      },
    ],
  },
  {
    title: "Communication",
    items: [
      {
        title: "Emails",
        url: "/dashboard/emails",
        icon: "solar:letter-bold-duotone",
      },
    ],
  },
  {
    title: "Finance & Accounting",
    items: [
      {
        title: "Cash & Treasury",
        url: "/dashboard/finance/cash-treasury",
        icon: "solar:banknote-bold-duotone",
      },
      {
        title: "Reports & Accounting",
        url: "/dashboard/finance/reports-accounting",
        icon: "solar:bill-list-bold-duotone",
      },
    ],
  },
  {
    title: "Analytics",
    items: [
      {
        title: "Statistics & Analytics",
        url: "/dashboard/analytics/statistics",
        icon: "solar:graph-up-bold-duotone",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: "solar:settings-bold-duotone",
      },
    ],
  },
];

function DashboardSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { 
    selectedBusiness, 
    selectedBusinessId, 
    userBusinesses,
    loading, 
    error, 
    hasAccess, 
    isBanned,
    switchBusiness
  } = useBusiness();
  
  const { open, setOpen } = useSidebar();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Debug logging
  console.log('Sidebar open state:', open);
  
  // Get current businessId from URL params
  const currentBusinessId = searchParams.get('businessId');

  // Ensure businessId is always present in URL
  useEffect(() => {
    if (!currentBusinessId && selectedBusinessId) {
      // If no businessId in URL but we have selectedBusinessId, redirect to include it
      const currentPath = pathname;
      const newUrl = `${currentPath}?businessId=${selectedBusinessId}`;
      router.replace(newUrl);
    }
  }, [currentBusinessId, selectedBusinessId, pathname, router]);

  // Helper function to build URLs with businessId parameter
  const buildUrlWithBusinessId = (href: string) => {
    if (!currentBusinessId) {
      // If no businessId in URL, try to get it from selectedBusinessId
      const businessId = selectedBusinessId || currentBusinessId;
      if (businessId) {
        const separator = href.includes('?') ? '&' : '?';
        return `${href}${separator}businessId=${businessId}`;
      }
      return href;
    }
    const separator = href.includes('?') ? '&' : '?';
    return `${href}${separator}businessId=${currentBusinessId}`;
  };

  // Handle logout with proper cleanup
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Clear any stored auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };


  // Show loading state in sidebar content if business data is loading
  if (loading) {
    return (
      <Sidebar variant="inset" className="border-r border-border/50">
        <SidebarHeader className="border-b border-border/50">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20">
              <Image src="/logo.png" alt="HRS App" width={24} height={24} className="object-contain" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold">HRS App</h1>
              <p className="text-xs text-muted-foreground">Loading...</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2 py-4">
          <div className="flex items-center justify-center py-8">
            <Icon icon="solar:loading-bold-duotone" className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r border-border/50 [&_[data-slot=sidebar-container]]:!z-0">
      <SidebarHeader className="border-b border-border/50">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 flex-shrink-0">
            <Image src="/logo.png" alt="HRS App" width={20} height={20} className="object-contain" />
          </div>
          <div className="flex flex-col flex-1 group-data-[collapsible=icon]:hidden">
            <h1 className="text-lg font-semibold">HRS App</h1>
            <p className="text-xs text-muted-foreground">Business Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {navigationData.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  // Remove locale prefix for comparison
                  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
                  const isActive = pathWithoutLocale.startsWith(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={buildUrlWithBusinessId(item.url)}>
                          <Icon icon={item.icon} className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50">
        <div className="flex items-center gap-3 px-2 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 hover:bg-muted">
                <Avatar className="h-8 w-8">
                  {selectedBusiness?.business?.logoFile ? (
                    <AvatarImage src={selectedBusiness.business.logoFile} alt={selectedBusiness.business.businessName} />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 text-xs font-semibold">
                    {selectedBusiness?.business?.businessName ? 
                      selectedBusiness.business.businessName.charAt(0).toUpperCase() : 
                      (user?.firstName && user?.lastName ? 
                        `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : 
                        'U'
                      )
                    }
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {selectedBusiness?.business?.businessName || (user?.firstName && user?.lastName ? 
                      `${user.firstName} ${user.lastName}` : 
                      user?.title || 'User'
                    )}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'user@example.com'}
                  </p>
                  {isBanned && (
                    <Badge variant="destructive" className="text-xs mt-1 w-fit">
                      Banned
                    </Badge>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Business Switching */}
              {userBusinesses && userBusinesses.length > 1 && (
                <>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Switch Business
                  </DropdownMenuLabel>
                  {userBusinesses.slice(0, 5).map((business) => (
                    <DropdownMenuItem
                      key={business.business?.id}
                      onClick={() => switchBusiness(business.business?.id!)}
                      className="cursor-pointer"
                    >
                      <Icon icon="solar:buildings-2-bold-duotone" className="mr-2 h-4 w-4" />
                      <span className="truncate">
                        {business.business?.businessName || 'Unnamed Business'}
                      </span>
                      {selectedBusinessId === business.business?.id && (
                        <Icon icon="solar:check-circle-bold-duotone" className="ml-auto h-4 w-4 text-green-500" />
                      )}
                    </DropdownMenuItem>
                  ))}
                  {userBusinesses.length > 5 && (
                    <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                      +{userBusinesses.length - 5} more businesses
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                </>
              )}
              
              {/* Settings */}
              <DropdownMenuItem asChild>
                <Link href={buildUrlWithBusinessId('/dashboard/settings')} className="cursor-pointer">
                  <Icon icon="solar:settings-bold-duotone" className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Logout */}
              <DropdownMenuItem 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                {isLoggingOut ? (
                  <Icon icon="solar:loading-bold-duotone" className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icon icon="solar:logout-3-bold-duotone" className="mr-2 h-4 w-4" />
                )}
                <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex flex-col min-w-0 flex-1">
            <p className="text-sm font-medium truncate whitespace-nowrap">
              {selectedBusiness?.business?.businessName || (user?.firstName && user?.lastName ? 
                `${user.firstName} ${user.lastName}` : 
                user?.title || 'User'
              )}
            </p>
            <p className="text-xs text-muted-foreground truncate whitespace-nowrap">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default React.memo(DashboardSidebar);
