'use client';

import React, { useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import Image from 'next/image';

type LeafItem = {
  name: string;
  href: string;
  icon: string;
};

type SectionItem = {
  name: string;
  icon: string;
  children?: LeafItem[];
  href?: string;
};

const DashboardSidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Operations: true,
    'CRM': false,
    'Finance & Accounting': false,
    'Analytics & Insights': false,
  });

  const sections: SectionItem[] = useMemo(
    () => [
      {
        name: 'Operations',
        icon: 'solar:shop-2-bold-duotone',
        children: [
          { name: 'Sales', href: '/dashboard/operations/sales', icon: 'solar:cart-large-2-bold-duotone' },
          { name: 'Purchases', href: '/dashboard/operations/purchases', icon: 'solar:bag-smile-bold-duotone' },
          { name: 'Inventory', href: '/dashboard/operations/inventory', icon: 'solar:box-bold-duotone' },
        ],
      },
      {
        name: 'CRM',
        icon: 'solar:users-group-rounded-bold-duotone',
        children: [
          { name: 'Clients', href: '/dashboard/crm/clients', icon: 'solar:user-id-bold-duotone' },
          { name: 'Suppliers', href: '/dashboard/crm/suppliers', icon: 'solar:users-group-two-rounded-bold-duotone' },
        ],
      },
      {
        name: 'Emails',
        icon: 'solar:letter-bold-duotone',
        href: '/dashboard/emails',
      },
      {
        name: 'Finance & Accounting',
        icon: 'solar:wallet-money-bold-duotone',
        children: [
          { name: 'Cash & Treasury', href: '/dashboard/finance/cash-treasury', icon: 'solar:banknote-bold-duotone' },
          { name: 'Reports & Accounting', href: '/dashboard/finance/reports-accounting', icon: 'solar:bill-list-bold-duotone' },
        ],
      },
      {
        name: 'Analytics & Insights',
        icon: 'solar:chart-2-bold-duotone',
        children: [
          { name: 'Statistics & Analytics', href: '/dashboard/analytics/statistics', icon: 'solar:graph-up-bold-duotone' },
        ],
    },
    {
      name: 'Settings',
        icon: 'solar:settings-bold-duotone',
      href: '/dashboard/settings',
      },
    ],
    []
  );

  const toggleSection = useCallback((name: string) => {
    setOpenSections((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const isActiveHref = (href?: string) => Boolean(href && pathname.startsWith(href));

  return (
    <aside
      className={`${isCollapsed ? 'w-20 cursor-pointer' : 'w-72'} bg-white/90 backdrop-blur-md border-r border-gray-200 shadow-xl relative transition-all duration-300 ease-out motion-reduce:transition-none`}
      aria-label="Sidebar navigation"
      onClick={() => {
        if (isCollapsed) {
          setIsCollapsed(false);
        }
      }}
    >
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm flex items-center justify-center">
              <Image src="/logo.png" alt="HRS App" width={24} height={24} className="object-contain" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-base font-bold text-gray-800">HRS App</h1>
                <p className="text-gray-500 text-[11px]">Dashboard</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleCollapse();
              }}
              aria-pressed={!isCollapsed}
              aria-label="Collapse sidebar"
              className="h-9 w-9 flex items-center justify-center rounded-md bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-600 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              title="Collapse"
            >
              <Icon icon="solar:alt-arrow-left-bold-duotone" width={18} height={18} />
            </button>
          )}
        </div>
      </div>
      
      <nav className={`px-2 pb-24 ${isCollapsed ? 'pointer-events-none' : ''}`} aria-label="Primary">
        {/* Decorative gradient rail */}
        <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-[#3c959d]/30 via-[#ef7335]/30 to-transparent" />

        {sections.map((section) => {
          const isLeaf = !section.children || section.children.length === 0;
          const open = openSections[section.name] ?? false;
          const active = isActiveHref(section.href);

          if (isLeaf) {
            return (
              <Link
                key={section.name}
                href={section.href || '#'}
                className={`group flex items-center justify-between px-2 py-2.5 rounded-lg mb-1 transition-all duration-300 motion-reduce:transition-none ${
                  active
                    ? 'bg-gradient-to-r from-[#3c959d]/10 to-[#ef7335]/10 text-gray-900 ring-1 ring-[#3c959d]/30'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 flex items-center justify-center flex-shrink-0">
                    <Icon icon={section.icon} className={active ? 'text-[#3c959d]' : 'text-gray-600'} width={18} height={18} />
                  </span>
                  {!isCollapsed && <span className="text-sm font-medium truncate">{section.name}</span>}
                </span>
                {!isCollapsed && section.name !== 'Settings' && (
                  <Icon icon="solar:alt-arrow-right-bold-duotone" className={active ? 'text-[#3c959d]' : 'text-gray-400 group-hover:text-gray-500'} width={18} height={18} />
                )}
              </Link>
            );
          }

          const hasActiveChild = section.children?.some((c) => isActiveHref(c.href));

          return (
            <div key={section.name} className="mb-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSection(section.name);
                }}
                aria-expanded={open}
                aria-controls={`section-${section.name}`}
                className={`group w-full flex items-center justify-between px-2 py-2.5 rounded-lg transition-all duration-300 motion-reduce:transition-none ${
                  hasActiveChild
                    ? 'bg-gradient-to-r from-[#3c959d]/10 to-[#ef7335]/10 text-gray-900 ring-1 ring-[#3c959d]/30'
                    : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 flex items-center justify-center flex-shrink-0">
                    <Icon icon={section.icon} className={hasActiveChild ? 'text-[#3c959d]' : 'text-gray-600'} width={18} height={18} />
                  </span>
                  {!isCollapsed && <span className="text-sm font-semibold truncate">{section.name}</span>}
                </span>
                {!isCollapsed && (
                  <Icon
                    icon="solar:alt-arrow-down-bold-duotone"
                    className={`text-gray-400 transition-transform duration-300 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
                    width={18}
                    height={18}
                  />
                )}
              </button>

              <div
                id={`section-${section.name}`}
                className={`overflow-hidden transition-all duration-300 motion-reduce:transition-none ${open && !isCollapsed ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="pl-3 pr-1 py-1">
                  {section.children?.map((child) => {
                    const childActive = isActiveHref(child.href);
            return (
              <Link
                        key={child.name}
                        href={child.href}
                        className={`flex items-center justify-between rounded-md px-3 py-2 text-sm mb-1 transition-all duration-200 motion-reduce:transition-none ${
                          childActive
                            ? 'bg-white shadow-sm ring-1 ring-[#3c959d]/30 text-gray-900'
                            : 'text-gray-600 hover:bg-white/60 hover:shadow-sm'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="h-7 w-7 rounded-md bg-gradient-to-br from-[#3c959d]/15 to-[#ef7335]/15 flex items-center justify-center flex-shrink-0">
                            <Icon icon={child.icon} className={childActive ? 'text-[#3c959d]' : 'text-gray-500'} width={16} height={16} />
                          </span>
                          <span className="truncate">{child.name}</span>
                        </span>
                        <span className={`h-1 w-1 rounded-full ${childActive ? 'bg-[#3c959d]' : 'bg-gray-300'}`} />
              </Link>
            );
          })}
        </div>
              </div>
            </div>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200/70 bg-white/80 backdrop-blur">
        <div className="flex items-center justify-between">
        <div className="flex items-center">
            <div className="w-9 h-9 bg-gradient-to-br from-[#3c959d]/20 to-[#ef7335]/20 rounded-full flex items-center justify-center">
              <Icon icon="solar:user-bold-duotone" className="text-gray-700" width={16} height={16} />
          </div>
            {!isCollapsed && (
          <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">User</p>
            <p className="text-xs text-gray-500">user@example.com</p>
          </div>
            )}
        </div>
          {!isCollapsed && (
            <Link href="/logout" className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
              <Icon icon="solar:logout-3-bold-duotone" width={14} height={14} />
              Logout
            </Link>
          )}
      </div>
    </div>
    </aside>
  );
};

export default React.memo(DashboardSidebar);
