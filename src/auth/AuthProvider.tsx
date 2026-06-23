import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { apiFetch, clearToken, getToken, saveToken } from '../lib/apiClient'
import type { LoginRequest, LoginResponse, User } from '../types/api'
import { AuthContext } from './auth-context'
import type { AuthStatus } from './auth-context'

// Gestiona la sesión: restaura al cargar, login y logout.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('restoring')

  // Restaurar sesión al montar: si hay token, validarlo con GET /auth/me.
  useEffect(() => {
    let cancelled = false

    async function restore() {
      if (!getToken()) {
        setStatus('unauthenticated')
        return
      }
      try {
        const me = await apiFetch<User>('/auth/me')
        if (cancelled) return
        setUser(me)
        setStatus('authenticated')
      } catch {
        // Token inválido o expirado: limpiar y exigir login.
        if (cancelled) return
        clearToken()
        setUser(null)
        setStatus('unauthenticated')
      }
    }

    void restore()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (credentials: LoginRequest) => {
    const res = await apiFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    saveToken(res.token)
    setUser(res.user)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
