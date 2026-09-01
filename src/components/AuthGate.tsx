import type { ReactNode } from 'react'
import { useSession } from '../hooks/useSession'
import { AuthScreen } from './AuthScreen'

export function AuthGate({ children }: { children: ReactNode }) {
  const { session, loading } = useSession()

  if (loading) return null
  if (!session) return <AuthScreen />
  return <>{children}</>
}
