import { useCallback, useEffect, useState } from 'react'
import { apiFetch, isAbortError } from '../lib/apiClient'
import type { DashboardSummary, Severity } from '../types/api'
import { ErrorState } from '../components/ErrorState'
import { KpiCard } from '../components/KpiCard'
import { Spinner } from '../components/Spinner'

type LoadState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; data: DashboardSummary }

const SEVERITY_ORDER: Severity[] = ['LEVE', 'MODERADO', 'GRAVE', 'CRITICO']

const SEVERITY_STYLES: Record<Severity, string> = {
  LEVE: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  MODERADO: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  GRAVE: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  CRITICO: 'bg-red-500/15 text-red-300 border-red-500/30',
}

export function DashboardPage() {
  const [state, setState] = useState<LoadState>({ kind: 'loading' })

  const load = useCallback((signal: AbortSignal) => {
    setState({ kind: 'loading' })
    apiFetch<DashboardSummary>('/dashboard/summary', {}, signal)
      .then((data) => setState({ kind: 'ready', data }))
      .catch((err) => {
        if (isAbortError(err)) return
        setState({
          kind: 'error',
          message: err instanceof Error ? err.message : 'No se pudo cargar el resumen.',
        })
      })
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load])

  function retry() {
    const controller = new AbortController()
    load(controller.signal)
  }

  return (
    <section>
      <h1 className="text-xl font-semibold tracking-tight">Resumen operativo</h1>
      <p className="mt-1 text-sm text-slate-400">Indicadores globales de la colonia.</p>

      <div className="mt-6 min-h-40">
        {state.kind === 'loading' && (
          <div className="grid place-items-center py-16">
            <Spinner label="Cargando indicadores…" />
          </div>
        )}

        {state.kind === 'error' && <ErrorState message={state.message} onRetry={retry} />}

        {state.kind === 'ready' && <DashboardContent data={state.data} />}
      </div>
    </section>
  )
}

function DashboardContent({ data }: { data: DashboardSummary }) {
  const severityEntries = SEVERITY_ORDER.map((key) => ({
    key,
    value: data.signalsBySeverity?.[key] ?? 0,
  }))
  const totalSignalsBySeverity = severityEntries.reduce((sum, e) => sum + e.value, 0)

  const isEmpty =
    data.totalTropels === 0 && data.openSignals === 0 && totalSignalsBySeverity === 0

  if (isEmpty) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-10 text-center text-slate-400">
        <p className="text-sm">Aún no hay actividad en la colonia.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Tropeles totales" value={data.totalTropels.toLocaleString()} />
        <KpiCard label="Tropeles críticos" value={data.criticalTropels.toLocaleString()} />
        <KpiCard label="Señales abiertas" value={data.openSignals.toLocaleString()} />
        <KpiCard
          label="Estabilidad media"
          value={`${data.sectorStabilityAvg}%`}
          hint="Promedio de sectores"
        />
      </div>

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Señales por severidad
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {severityEntries.map(({ key, value }) => (
            <div key={key} className={`rounded-lg border p-4 ${SEVERITY_STYLES[key]}`}>
              <p className="text-xs font-medium uppercase tracking-wide">{key}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-600">
        Actualizado: {new Date(data.generatedAt).toLocaleString()}
      </p>
    </div>
  )
}
