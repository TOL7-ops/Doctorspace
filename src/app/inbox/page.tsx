import React from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { getCurrentUserServer, getMessagesServer } from '@/lib/server-queries';
import { redirect } from 'next/navigation';

export default async function InboxPage() {
  const user = await getCurrentUserServer();
  
  if (!user) {
    redirect('/login');
  }

  const messages = await getMessagesServer(user.id);

  return (
    <div className="pb-20 max-w-lg mx-auto bg-white min-h-screen">
      <DashboardHeader userName={user.patients?.full_name?.split(' ')[0] || 'User'} />
      
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Inbox</h1>
          {messages.some(m => !m.read) && (
            <button className="text-sm text-blue-600 font-medium">
              Mark all as read
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${
                message.read ? 'bg-gray-50' : 'bg-blue-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{message.sender?.full_name || 'Unknown'}</h3>
                  <p className="text-sm text-gray-600">{message.subject}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(message.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{message.content}</p>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
} 