'use client';

import React, { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';

type NavItem = {
  id: string;
  name: string;
  icon?: string;
  description?: string;
};

type NavSection = {
  name: string;
  icon?: string;
  items: NavItem[];
};

const sectionsData: NavSection[] = [
  {
    name: 'General',
    icon: 'solar:settings-bold-duotone',
    items: [
      { 
        id: 'company-info', 
        name: 'Company Information', 
        icon: 'solar:buildings-2-bold-duotone',
        description: 'Manage your business details and contact information'
      },
      { 
        id: 'pos-settings', 
        name: 'Point of Sale Settings', 
        icon: 'solar:cart-large-2-bold-duotone',
        description: 'Configure POS system preferences'
      },
      { 
        id: 'fiscal-stamp', 
        name: 'Fiscal Stamp', 
        icon: 'solar:verified-check-bold-duotone',
        description: 'Manage fiscal compliance settings'
      },
    ],
  },
  {
    name: 'Localization',
    icon: 'mdi:earth',
    items: [
      { 
        id: 'postal-codes', 
        name: 'Postal Codes', 
        icon: 'mdi:mailbox-outline',
        description: 'Configure postal code database'
      },
      { 
        id: 'banks', 
        name: 'Banks', 
        icon: 'mdi:bank',
        description: 'Manage banking institutions'
      },
      { 
        id: 'bank-branches', 
        name: 'Bank Branches', 
        icon: 'mdi:bank-outline',
        description: 'Configure bank branch information'
      },
    ],
  },
  {
    name: 'Finance',
    icon: 'solar:wallet-money-bold-duotone',
    items: [
      { 
        id: 'payment-modes', 
        name: 'Payment Modes', 
        icon: 'solar:card-2-bold-duotone',
        description: 'Set up payment methods and processing'
      },
      { 
        id: 'cash-categories', 
        name: 'Cash Categories', 
        icon: 'solar:banknote-bold-duotone',
        description: 'Organize cash flow categories'
      },
    ],
  },
  {
    name: 'Users & Security',
    icon: 'solar:shield-check-bold-duotone',
    items: [
      { 
        id: 'users', 
        name: 'Users', 
        icon: 'solar:users-group-rounded-bold-duotone',
        description: 'Manage user accounts and profiles'
      },
      { 
        id: 'roles-permissions', 
        name: 'Roles & Permissions', 
        icon: 'solar:key-minimalistic-square-2-bold-duotone',
        description: 'Configure access control and permissions'
      },
      { 
        id: 'switch-user', 
        name: 'Switch User', 
        icon: 'mdi:account-switch',
        description: 'Change active user session'
      },
      { 
        id: 'change-password', 
        name: 'Change Password', 
        icon: 'solar:lock-password-unlocked-bold-duotone',
        description: 'Update your current password'
      },
      { 
        id: 'reset-password', 
        name: 'Reset Password', 
        icon: 'solar:lock-password-bold-duotone',
        description: 'Reset forgotten passwords'
      },
    ],
  },
  {
    name: 'System',
    icon: 'solar:cpu-bolt-bold-duotone',
    items: [
      { 
        id: 'counter-management', 
        name: 'Counter Management', 
        icon: 'mdi:view-grid-plus',
        description: 'Configure system counters and sequences'
      },
      { 
        id: 'file-reindexation', 
        name: 'File Reindexation', 
        icon: 'solar:refresh-bold-duotone',
        description: 'Rebuild file indexes and optimize performance'
      },
      { 
        id: 'license', 
        name: 'License', 
        icon: 'solar:document-add-bold-duotone',
        description: 'Manage software licensing and activation'
      },
      { 
        id: 'updates', 
        name: 'Updates', 
        icon: 'solar:download-minimalistic-bold-duotone',
        description: 'Check for and install system updates'
      },
      { 
        id: 'reset-system', 
        name: 'Reset System', 
        icon: 'solar:danger-triangle-bold-duotone',
        description: 'Restore system to factory defaults'
      },
    ],
  },
  {
    name: 'Advanced',
    icon: 'solar:settings-bold-duotone',
    items: [
      { 
        id: 'audit-logs', 
        name: 'Audit Logs', 
        icon: 'solar:clipboard-check-bold-duotone',
        description: 'View system activity and security logs'
      },
      { 
        id: 'data-import-export', 
        name: 'Data Import/Export', 
        icon: 'solar:export-bold-duotone',
        description: 'Transfer data in and out of the system'
      },
      { 
        id: 'backup-restore', 
        name: 'Backup & Restore', 
        icon: 'solar:database-bold-duotone',
        description: 'Create backups and restore system data'
      },
    ],
  },
];

export default function SettingsPage() {
  const [activeId, setActiveId] = useState<string>('company-info');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const flatItems = useMemo(() => sectionsData.flatMap((s) => s.items), []);
  const activeItem = useMemo(() => flatItems.find((i) => i.id === activeId), [flatItems, activeId]);
  const activeSection = useMemo(() => sectionsData.find(s => s.items.some(i => i.id === activeId)), [activeId]);
  
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sectionsData;
    
    return sectionsData.map(section => ({
      ...section,
      items: section.items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(section => section.items.length > 0);
  }, [searchQuery]);
  
  const DEFAULT_ICON = 'solar:settings-bold-duotone';

  return (
    <div className="bg-gradient-to-br from-gray-50/50 to-white overflow-hidden w-full min-h-screen -mt-6 -mx-6 rounded-none shadow-none border-0">
      {/* Enhanced Header */}
      <div className="px-6 py-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 flex items-center justify-center shadow-sm">
                <Icon icon={activeItem?.icon || DEFAULT_ICON} className="text-[#3c959d]" width={24} height={24} />
              </span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{activeItem?.name || 'Settings'}</h1>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3c959d]"></span>
                  {activeSection?.name}
                  {activeItem?.description && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{activeItem.description}</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="h-10 w-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors">
              <Icon icon="solar:question-circle-bold-duotone" className="text-gray-500" width={18} height={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-140px)]">
        {/* Enhanced Left Navigation */}
        <aside className="lg:col-span-4 xl:col-span-3 border-r border-gray-100 bg-white/60 backdrop-blur-sm">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={16} height={16} />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm focus:border-[#3c959d] focus:ring-1 focus:ring-[#3c959d] focus:bg-white transition-all text-sm"
              />
            </div>
          </div>
          
          <nav className="p-4 overflow-auto h-[calc(100vh-220px)]">
            <div className="space-y-6">
              {filteredSections.map((section) => (
                <div key={section.name} className="space-y-2">
                  <div className="px-3 py-2 flex items-center gap-3">
                    <span className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#3c959d]/15 to-[#ef7335]/15 flex items-center justify-center">
                      <Icon icon={section.icon || DEFAULT_ICON} className="text-[#3c959d]" width={14} height={14} />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">{section.name}</span>
                  </div>
                  
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const selected = item.id === activeId;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          className={`w-full text-left p-3 rounded-xl transition-all duration-200 group ${
                            selected
                              ? 'bg-gradient-to-r from-[#3c959d]/10 to-[#ef7335]/10 text-gray-900 ring-1 ring-[#3c959d]/20 shadow-sm'
                              : 'text-gray-700 hover:bg-white/80 hover:shadow-sm'
                          }`}
                          onClick={() => setActiveId(item.id)}
                        >
                          <div className="flex items-start gap-3">
                            <span className={`mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
                              selected 
                                ? 'bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 shadow-sm' 
                                : 'bg-gray-100 group-hover:bg-gray-200'
                            }`}>
                              <Icon 
                                icon={item.icon || DEFAULT_ICON} 
                                className={selected ? 'text-[#3c959d]' : 'text-gray-500 group-hover:text-gray-600'} 
                                width={16} 
                                height={16} 
                              />
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.name}</p>
                              {item.description && (
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </aside>

        {/* Enhanced Right Content */}
        <section className="lg:col-span-8 xl:col-span-9 bg-white/40 backdrop-blur-sm">
          <div className="p-8 h-full">
            <div className="max-w-2xl">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 flex items-center justify-center mx-auto mb-4">
                  <Icon icon={activeItem?.icon || DEFAULT_ICON} className="text-[#3c959d]" width={32} height={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{activeItem?.name}</h3>
                <p className="text-gray-600 mb-6">{activeItem?.description || 'This settings panel is coming soon.'}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 text-orange-700 text-sm font-medium">
                  <Icon icon="solar:settings-linear" width={16} height={16} />
                  Configuration panel coming soon
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}