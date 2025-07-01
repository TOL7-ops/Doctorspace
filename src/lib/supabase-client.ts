'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

// Create a single supabase client for interacting with your database from client components
export const createBrowserSupabase = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Export a singleton instance for client components
export const supabase = createBrowserSupabase() 