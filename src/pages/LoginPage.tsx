import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

// Login del equipo: teamCode + email + password.
export function LoginPage() {
  const { status, login } = useAuth()
  const navigate = useNavigate()

  const [teamCode, setTeamCode] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Si ya hay sesión, no mostrar el login.
  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login({ teamCode, email, password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center bg-slate-950 px-4 text-slate-100">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">TropelCare</h1>
          <p className="mt-1 text-sm text-slate-400">Control Room — acceso de operadores</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
        >
          <Field
            id="teamCode"
            label="Código de equipo"
            value={teamCode}
            onChange={setTeamCode}
            placeholder="TEAM-0XX"
            autoComplete="organization"
          />
          <Field
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="operator@tuckersoft.com"
            autoComplete="username"
          />
          <Field
            id="password"
            label="Contraseña"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          {error && (
            <p role="alert" className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 font-medium text-slate-950 transition-colors hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Ingresando…' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}

// Campo de formulario controlado y accesible.
function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
  autoComplete?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-300">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-100 placeholder:text-slate-600 focus-visible:border-emerald-400 focus-visible:outline-none"
      />
    </div>
  )
}
