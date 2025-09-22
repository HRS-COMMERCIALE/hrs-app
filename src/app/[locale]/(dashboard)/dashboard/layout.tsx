'use client';

import React, { useState } from 'react';
import DashboardSidebar from '@/components/layout/Sidebar/DashboardSidebar';
import { BusinessProvider } from '@/store/businessProvider';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useBusinessAccessValidation } from '@/hooks/useBusinessAccessValidation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner/LoadingSpinner';
import { Icon } from '@iconify/react';
import { Building2, Shield } from 'lucide-react';
import { useNotifications, getNotificationIcon, getNotificationColorClasses } from '@/store/notificationProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Business validation wrapper component
function BusinessValidationWrapper({ children }: { children: React.ReactNode }) {
  const { isValid, isLoading, error, businessId, isBanned } = useBusinessAccessValidation();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification 
  } = useNotifications();

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
            
            {/* Notification Bell */}
            <DropdownMenu open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative h-9 w-9 rounded-lg hover:bg-muted"
                >
                  <Icon icon="solar:bell-bold-duotone" className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-80 rounded-xl border-0 shadow-xl"
                side="bottom"
                sideOffset={8}
              >
                <div className="flex items-center justify-between p-4 pb-2">
                  <DropdownMenuLabel className="text-base font-semibold p-0">
                    Notifications
                  </DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
                <Separator />
                
                <ScrollArea className="h-80">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4">
                      <div className="p-3 bg-muted rounded-full mb-3">
                        <Icon icon="solar:bell-off-bold-duotone" className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    <div className="p-2">
                      {notifications.map((notification) => {
                        const IconComponent = getNotificationIcon(notification.type);
                        const colors = getNotificationColorClasses(notification.type);
                        
                        return (
                          <div
                            key={notification.id}
                            className={`relative p-3 rounded-lg mb-2 transition-all hover:bg-muted/50 ${
                              !notification.read ? 'bg-muted/30' : ''
                            }`}
                            onClick={() => {
                              if (!notification.read) {
                                markAsRead(notification.id);
                              }
                              if (notification.action) {
                                notification.action.onClick();
                              }
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-1.5 rounded-full ${colors.bg} flex-shrink-0`}>
                                <IconComponent className={`h-4 w-4 ${colors.icon}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className={`text-sm font-medium ${colors.text} truncate`}>
                                    {notification.title}
                                  </h4>
                                  {!notification.read && (
                                    <div className={`h-2 w-2 rounded-full ${colors.dot} flex-shrink-0 mt-1.5`} />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {notification.timestamp.toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </p>
                                {notification.action && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs mt-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      notification.action!.onClick();
                                    }}
                                  >
                                    {notification.action.label}
                                  </Button>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive flex-shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeNotification(notification.id);
                                }}
                              >
                                <Icon icon="solar:close-circle-bold-duotone" className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {isLoading || isValid === null ? (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <LoadingSpinner 
                  icon={Building2}
                  message="Validating business access..."
                  variant="default"
                  size="lg"
                />
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

