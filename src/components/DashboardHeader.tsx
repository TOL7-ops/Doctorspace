'use client';

import React from 'react';
import { MagnifyingGlassIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface DashboardHeaderProps {
  userName: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center p-4">
      <h1 className="text-xl font-semibold">Hello {userName}!</h1>
      <div className="flex items-center space-x-4">
        <button className="p-2">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-600" />
        </button>
        <button className="p-2">
          <BellIcon className="h-6 w-6 text-gray-600" />
        </button>
        <button className="p-2">
          <UserCircleIcon className="h-6 w-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
} 