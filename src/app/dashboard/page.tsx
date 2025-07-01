'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getUserProfile } from '@/lib/queries';
import type { User } from '@supabase/supabase-js';
import type { UserProfileData } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace('/login');
          return;
        }
        setUser(user);

        // Fetch user profile data
        console.log('Fetching profile for user:', user.id);
        const profileData = await getUserProfile(user.id);
        
        if (profileData) {
          setProfile(profileData);
          console.log('Profile data loaded:', profileData);
        } else {
          setProfileError('Profile not found. Please complete your profile setup.');
          console.warn('No profile found for user:', user.id);
        }
      } catch (error) {
        console.error('Error fetching user or profile:', error);
        setProfileError('Error loading profile data');
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign Out
            </button>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {profile ? (
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Welcome, {profile.full_name}!
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{profile.full_name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{profile.email}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Role</dt>
                      <dd className="mt-1 text-sm text-gray-900 capitalize">{profile.role}</dd>
                    </div>
                    {profile.phone && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd className="mt-1 text-sm text-gray-900">{profile.phone}</dd>
                      </div>
                    )}
                    {profile.phone_number && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                        <dd className="mt-1 text-sm text-gray-900">{profile.phone_number}</dd>
                      </div>
                    )}
                  </div>
                </div>
              ) : profileError ? (
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Welcome, {user.email}!
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-red-600">
                    <p>{profileError}</p>
                  </div>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Your account is authenticated, but profile information could not be loaded.</p>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Welcome, {user.email}!
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>You are successfully signed in to your account.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 