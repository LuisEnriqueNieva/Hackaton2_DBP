import { Navigate, Outlet } from 'react-router-dom'
import { Spinner } from '../components/Spinner'
import { useAuth } from './useAuth'

// Ruta privada: espera la restauración de sesión y redirige a /login si no hay sesión.
export function ProtectedRoute() {
  const { status } = useAuth()

  if (status === 'restoring') {
    return (
      <div className="grid min-h-dvh place-items-center bg-slate-950">
        <Spinner label="Restaurando sesión…" />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
