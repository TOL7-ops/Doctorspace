'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

// Create a single supabase client for interacting with your database from client components
// Environment variables are automatically handled by Next.js
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
) 