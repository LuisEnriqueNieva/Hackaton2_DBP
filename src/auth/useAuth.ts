import { useContext } from 'react'
import { AuthContext } from './auth-context'

// Hook de acceso a la sesión. Lanza si se usa fuera del provider.
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return ctx
}
