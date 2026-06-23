import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { isAbortError } from '../../lib/apiClient'
import type { SectorListItem } from '../../types/api'
import { ErrorState } from '../../components/ErrorState'
import { Spinner } from '../../components/Spinner'
import { fetchSectors } from '../tropels/tropelsApi'

type State =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; sectors: SectorListItem[] }

export function SectorsPage() {
  const [state, setState] = useState<State>({ kind: 'loading' })
  const [reload, setReload] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setState({ kind: 'loading' })
    fetchSectors(controller.signal)
      .then((res) => setState({ kind: 'ready', sectors: res.items }))
      .catch((err) => {
        if (isAbortError(err)) return
        setState({
          kind: 'error',
          message: err instanceof Error ? err.message : 'No se pudieron cargar los sectores.',
        })
      })
    return () => controller.abort()
  }, [reload])

  return (
    <section>
      <header className="mb-5">
        <h1 className="text-xl font-semibold tracking-tight">Sectores</h1>
        <p className="mt-1 text-sm text-slate-400">
          Explora la historia (scrollytelling) de cada sector.
        </p>
      </header>

      {state.kind === 'loading' && (
        <div className="grid place-items-center py-16">
          <Spinner label="Cargando sectores…" />
        </div>
      )}

      {state.kind === 'error' && (
        <ErrorState message={state.message} onRetry={() => setReload((n) => n + 1)} />
      )}

      {state.kind === 'ready' && state.sectors.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-10 text-center text-slate-400">
          <p className="text-sm">No hay sectores disponibles.</p>
        </div>
      )}

      {state.kind === 'ready' && state.sectors.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.sectors.map((sector) => (
            <Link
              key={sector.id}
              to={`/sectors/${sector.id}`}
              className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5 transition-colors hover:border-emerald-500/50 hover:bg-slate-800/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
            >
              <p className="text-xs uppercase tracking-wide text-slate-500">{sector.climate}</p>
              <h2 className="mt-1 font-semibold text-slate-100">{sector.name}</h2>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Carga {sector.currentLoad}/{sector.capacity}
                </span>
                <span>Estabilidad {sector.stabilityLevel}</span>
              </div>
              <p className="mt-3 text-sm font-medium text-emerald-400">Ver historia →</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
