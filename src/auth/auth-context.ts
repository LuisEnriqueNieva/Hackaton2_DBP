import { createContext } from 'react'
import type { LoginRequest, User } from '../types/api'

export type AuthStatus = 'restoring' | 'authenticated' | 'unauthenticated'

export interface AuthContextValue {
  user: User | null
  status: AuthStatus
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
}

// Contexto separado del provider para mantener Fast Refresh limpio.
export const AuthContext = createContext<AuthContextValue | null>(null)
