import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next'

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  ''
export const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export type SupabasePagesServerContext =
  | GetServerSidePropsContext
  | { req: NextApiRequest; res: NextApiResponse }

// Server client with auth helpers
export const createSupabaseServerClient = (
  context?: SupabasePagesServerContext
) => {
  if (!context) {
    throw new Error('createSupabaseServerClient requires a server-side context')
  }
  return createPagesServerClient(context)
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