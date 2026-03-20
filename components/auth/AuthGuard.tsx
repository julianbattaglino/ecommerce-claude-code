import { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthContext'
import Loading from '@/components/ui/Loading'

interface AuthGuardProps {
  children: ReactNode
  requireAdmin?: boolean
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  if (loading) {
    return <Loading fullScreen text="Loading..." />
  }

  if (!user) {
    router.push(`/auth/login?redirect=${encodeURIComponent(router.asPath)}`)
    return <Loading fullScreen text="Redirecting to login..." />
  }

  if (requireAdmin && !isAdmin) {
    router.push('/')
    return <Loading fullScreen text="Access denied. Redirecting..." />
  }

  return <>{children}</>
}