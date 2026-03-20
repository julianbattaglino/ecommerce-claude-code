import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabaseBrowserClient } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  role: 'admin' | 'customer' | null
  loading: boolean
  isAdmin: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>
  signUpWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || ''

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<'admin' | 'customer' | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  const isAdmin = user?.email === ADMIN_EMAIL || role === 'admin'

  useEffect(() => {
    setIsMounted(true)

    // Solo ejecutar si Supabase está configurado
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)) {
      setLoading(false)
      return
    }

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabaseBrowserClient.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)

        // Determinar rol desde tabla `profiles` (o `users` como alternativa)
        if (session?.user?.email) {
          if (session.user.email === ADMIN_EMAIL) {
            setRole('admin')
          } else {
            const { data: profileData, error: profileError } = await supabaseBrowserClient
              .from('profiles')
              .select('role')
              .eq('email', session.user.email)
              .single()

            if (!profileError && profileData?.role === 'admin') {
              setRole('admin')
            } else {
              setRole('customer')
            }
          }
        }

        setLoading(false)
      } catch (error) {
        console.error('Error getting session:', error)
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabaseBrowserClient.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
    await supabaseBrowserClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabaseBrowserClient.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabaseBrowserClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { error }
  }

  const signOut = async () => {
    await supabaseBrowserClient.auth.signOut()
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        loading: isMounted ? loading : true,
        isAdmin,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}