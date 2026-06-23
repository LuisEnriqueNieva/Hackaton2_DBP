import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { isAbortError } from '../../lib/apiClient'
import type { SectorListItem, TropelPage } from '../../types/api'
import { ErrorState } from '../../components/ErrorState'
import { FilterSelect, SearchInput } from '../FilterControls'
import { PAGE_SIZES, SPECIES, TROPEL_SORTS, VITAL_STATES } from '../constants'
import { fetchSectors, fetchTropels } from './tropelsApi'
import type { TropelQuery } from './tropelsApi'
import { TropelCard } from './TropelCard'

const DEFAULT_SIZE = 20
const DEFAULT_SORT = 'updatedAt,desc'

// Lee el estado completo de filtros desde la URL (restauración exacta).
function parseQuery(sp: URLSearchParams): TropelQuery {
  const rawPage = Number(sp.get('page'))
  const rawSize = Number(sp.get('size'))
  return {
    page: Number.isInteger(rawPage) && rawPage >= 0 ? rawPage : 0,
    size: PAGE_SIZES.includes(rawSize as (typeof PAGE_SIZES)[number]) ? rawSize : DEFAULT_SIZE,
    sort: sp.get('sort') ?? DEFAULT_SORT,
    species: sp.get('species') ?? undefined,
    vitalState: sp.get('vitalState') ?? undefined,
    sectorId: sp.get('sectorId') ?? undefined,
    q: sp.get('q') ?? undefined,
  }
}

type State =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; page: TropelPage }

export function TropelsPage() {
  const [sp, setSp] = useSearchParams()
  const query = useMemo(() => parseQuery(sp), [sp])
  const [state, setState] = useState<State>({ kind: 'loading' })
  const [sectors, setSectors] = useState<SectorListItem[]>([])

  // Carga de tropeles con cancelación de requests obsoletas (AbortController).
  useEffect(() => {
    const controller = new AbortController()
    setState({ kind: 'loading' })
    fetchTropels(query, controller.signal)
      .then((page) => setState({ kind: 'ready', page }))
      .catch((err) => {
        if (isAbortError(err)) return
        setState({
          kind: 'error',
          message: err instanceof Error ? err.message : 'No se pudieron cargar los Tropeles.',
        })
      })
    return () => controller.abort()
  }, [query])

  // Sectores para el filtro (una sola vez).
  useEffect(() => {
    const controller = new AbortController()
    fetchSectors(controller.signal)
      .then((res) => setSectors(res.items))
      .catch(() => {
        /* el filtro por sector queda vacío si falla; no bloquea la vista */
      })
    return () => controller.abort()
  }, [])

  // Cambia un filtro y resetea a la página 0; quita el param si queda vacío.
  const setFilter = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(sp)
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete('page')
      setSp(next)
    },
    [sp, setSp],
  )

  const goToPage = useCallback(
    (page: number) => {
      const next = new URLSearchParams(sp)
      next.set('page', String(page))
      setSp(next)
    },
    [sp, setSp],
  )

  return (
    <section>
      <header className="mb-5">
        <h1 className="text-xl font-semibold tracking-tight">Atlas de Tropeles</h1>
        <p className="mt-1 text-sm text-slate-400">
          Paginación y filtros del servidor reflejados en la URL.
        </p>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <SearchInput
          label="Buscar"
          value={query.q ?? ''}
          onCommit={(v) => setFilter('q', v)}
          placeholder="Nombre…"
        />
        <FilterSelect
          label="Especie"
          value={query.species ?? ''}
          onChange={(v) => setFilter('species', v)}
          options={SPECIES.map((s) => ({ value: s, label: s }))}
          allLabel="Todas"
        />
        <FilterSelect
          label="Estado vital"
          value={query.vitalState ?? ''}
          onChange={(v) => setFilter('vitalState', v)}
          options={VITAL_STATES.map((s) => ({ value: s, label: s }))}
          allLabel="Todos"
        />
        <FilterSelect
          label="Sector"
          value={query.sectorId ?? ''}
          onChange={(v) => setFilter('sectorId', v)}
          options={sectors.map((s) => ({ value: s.id, label: s.name }))}
          allLabel="Todos"
        />
        <FilterSelect
          label="Orden"
          value={query.sort}
          onChange={(v) => setFilter('sort', v)}
          options={TROPEL_SORTS}
          allLabel="Por defecto"
        />
        <FilterSelect
          label="Por página"
          value={String(query.size)}
          onChange={(v) => setFilter('size', v)}
          options={PAGE_SIZES.map((n) => ({ value: String(n), label: String(n) }))}
          allLabel={String(DEFAULT_SIZE)}
        />
      </div>

      {/* min-height reservado para no mover el layout durante la carga */}
      <div className="min-h-[60vh]">
        {state.kind === 'loading' && <TropelSkeletonGrid count={query.size} />}

        {state.kind === 'error' && (
          <ErrorState message={state.message} onRetry={() => goToPage(query.page)} />
        )}

        {state.kind === 'ready' && state.page.content.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-10 text-center text-slate-400">
            <p className="text-sm">No hay Tropeles que coincidan con los filtros.</p>
          </div>
        )}

        {state.kind === 'ready' && state.page.content.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {state.page.content.map((t) => (
                <TropelCard key={t.id} tropel={t} />
              ))}
            </div>
            <Pagination page={state.page} onChange={goToPage} />
          </>
        )}
      </div>
    </section>
  )
}

function Pagination({ page, onChange }: { page: TropelPage; onChange: (page: number) => void }) {
  const isFirst = page.currentPage <= 0
  const isLast = page.currentPage >= page.totalPages - 1
  return (
    <nav className="mt-6 flex items-center justify-between text-sm">
      <p className="text-slate-500">
        {page.totalElements.toLocaleString()} Tropeles · página {page.currentPage + 1} de{' '}
        {Math.max(page.totalPages, 1)}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={isFirst}
          onClick={() => onChange(page.currentPage - 1)}
          className="rounded-md border border-slate-700 px-3 py-1.5 font-medium text-slate-300 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>
        <button
          type="button"
          disabled={isLast}
          onClick={() => onChange(page.currentPage + 1)}
          className="rounded-md border border-slate-700 px-3 py-1.5 font-medium text-slate-300 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </nav>
  )
}

function TropelSkeletonGrid({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-40 rounded-xl border border-slate-800 bg-slate-800/30 motion-safe:animate-pulse"
        />
      ))}
    </div>
  )
}
