'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from './types'

// Create a single supabase client for interacting with your database from client components
export const createBrowserSupabase = () => {
  return createClientComponentClient<Database>()
}

// Export a singleton instance for client components
export const supabase = createBrowserSupabase() 