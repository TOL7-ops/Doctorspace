'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from './types'

// Create a single supabase client for interacting with your database from client components
export const supabase = createClientComponentClient<Database>()

// Validate environment variables
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Debug environment variables
console.log('Environment Variables:', process.env);

if (!supabaseServiceKey) {
  console.error(
    'Missing environment variable. Check your .env.local file for:',
    !supabaseServiceKey ? '\n- SUPABASE_SERVICE_ROLE_KEY' : ''
  );
  throw new Error('Missing required environment variable for Supabase');
} 