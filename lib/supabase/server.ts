import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || ''
export const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Server client with auth helpers
export const createSupabaseServerClient = (req?: NextRequest) => {
  if (req) {
    return createPagesServerClient({ req, supabaseUrl, supabaseKey: supabaseAnonKey })
  }
  // Para uso en server components sin req
  return createPagesServerClient({ supabaseUrl, supabaseKey: supabaseAnonKey })
}

// Admin client with service role (bypasses RLS)
export const createSupabaseAdminClient = () => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}