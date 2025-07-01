'use client';

import React from 'react';
import Link from 'next/link';
import { HomeIcon, CalendarIcon, InboxIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Appointments', href: '/appointments', icon: CalendarIcon },
  { name: 'Inbox', href: '/inbox', icon: InboxIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 