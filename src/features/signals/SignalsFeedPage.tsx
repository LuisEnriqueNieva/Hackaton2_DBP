import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { isAbortError } from '../../lib/apiClient'
import { ErrorState } from '../../components/ErrorState'
import { Spinner } from '../../components/Spinner'
import { FilterSelect, SearchInput } from '../FilterControls'
import { SEVERITIES, SIGNAL_STATUSES, SIGNAL_TYPES } from '../constants'
import { fetchSignalsFeed, signalFilterKey } from './signalsApi'
import type { SignalFilters } from './signalsApi'
import { SignalCard } from './SignalCard'
import { useSignalsContext } from './useSignalsContext'

function parseFilters(sp: URLSearchParams): SignalFilters {
  return {
    signalType: sp.get('signalType') ?? undefined,
    severity: sp.get('severity') ?? undefined,
    status: sp.get('status') ?? undefined,
    q: sp.get('q') ?? undefined,
  }
}

export function SignalsFeedPage() {
  const [sp, setSp] = useSearchParams()
  const filters = useMemo(() => parseFilters(sp), [sp])
  const key = signalFilterKey(filters)

  const { snapshot, reset, appendPage, setScrollY } = useSignalsContext()

  const [pageError, setPageError] = useState<string | null>(null)
  const loadingRef = useRef(false)
  const controllerRef = useRef<AbortController | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // Refs con el último valor para que el loader sea estable pero lea datos frescos.
  const snapshotRef = useRef(snapshot)
  snapshotRef.current = snapshot
  const filtersRef = useRef(filters)
  filtersRef.current = filters

  // Carga una página. Garantiza una sola request en vuelo a la vez.
  const loadPage = useCallback(
    async (mode: 'initial' | 'more') => {
      if (loadingRef.current) return
      const snap = snapshotRef.current
      if (mode === 'more' && (!snap.hasMore || snap.nextCursor === null)) return

      loadingRef.current = true
      setPageError(null)
      const controller = new AbortController()
      controllerRef.current = controller

      try {
        const cursor = mode === 'initial' ? null : snap.nextCursor
        const res = await fetchSignalsFeed(filtersRef.current, cursor, controller.signal)
        appendPage(res.items, res.nextCursor, res.hasMore, res.totalEstimate)
      } catch (err) {
        // Un error en una página posterior NO borra las páginas ya cargadas.
        if (!isAbortError(err)) {
          setPageError(err instanceof Error ? err.message : 'No se pudieron cargar las señales.')
        }
      } finally {
        loadingRef.current = false
      }
    },
    [appendPage],
  )

  // Al cambiar los filtros: cancelar request en vuelo y reiniciar el feed.
  useEffect(() => {
    if (snapshotRef.current.key !== key) {
      controllerRef.current?.abort()
      loadingRef.current = false
      reset(key)
    }
  }, [key, reset])

  // Cargar la primera página una sola vez por cada conjunto de filtros.
  useEffect(() => {
    if (snapshot.key === key && !snapshot.loaded && !loadingRef.current) {
      void loadPage('initial')
    }
  }, [snapshot.key, snapshot.loaded, key, loadPage])

  // Infinite scroll: cargar más al acercarse el centinela al viewport.
  // Se re-observa cuando cambia el pie del feed (el centinela es un nodo nuevo
  // tras recuperar un error o al pasar de loading a cargado).
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadPage('more')
      },
      { rootMargin: '300px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [loadPage, pageError, snapshot.hasMore, snapshot.loaded])

  // Restaurar scroll al volver del detalle; guardarlo al salir.
  useLayoutEffect(() => {
    const saved = snapshotRef.current.scrollY
    if (saved > 0) window.scrollTo(0, saved)
    return () => setScrollY(window.scrollY)
  }, [setScrollY])

  const setFilter = useCallback(
    (filterKey: string, value: string) => {
      const next = new URLSearchParams(sp)
      if (value) next.set(filterKey, value)
      else next.delete(filterKey)
      setSp(next)
    },
    [sp, setSp],
  )

  const { items, hasMore, loaded, totalEstimate } = snapshot
  const showInitialLoading = !loaded && !pageError

  return (
    <section>
      <header className="mb-5">
        <h1 className="text-xl font-semibold tracking-tight">Feed de Señales</h1>
        <p className="mt-1 text-sm text-slate-400">
          Scroll infinito basado en cursor · {totalEstimate.toLocaleString()} estimadas.
        </p>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SearchInput
          label="Buscar"
          value={filters.q ?? ''}
          onCommit={(v) => setFilter('q', v)}
          placeholder="Contenido…"
        />
        <FilterSelect
          label="Tipo"
          value={filters.signalType ?? ''}
          onChange={(v) => setFilter('signalType', v)}
          options={SIGNAL_TYPES.map((s) => ({ value: s, label: s }))}
        />
        <FilterSelect
          label="Severidad"
          value={filters.severity ?? ''}
          onChange={(v) => setFilter('severity', v)}
          options={SEVERITIES.map((s) => ({ value: s, label: s }))}
        />
        <FilterSelect
          label="Estado"
          value={filters.status ?? ''}
          onChange={(v) => setFilter('status', v)}
          options={SIGNAL_STATUSES.map((s) => ({ value: s, label: s }))}
        />
      </div>

      {showInitialLoading && (
        <div className="grid place-items-center py-16">
          <Spinner label="Cargando señales…" />
        </div>
      )}

      {loaded && items.length === 0 && !pageError && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-10 text-center text-slate-400">
          <p className="text-sm">No hay señales que coincidan con los filtros.</p>
        </div>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      )}

      {/* Pie del feed: centinela, cargando-más, error recuperable o fin de lista */}
      <div className="py-8">
        {pageError ? (
          <ErrorState message={pageError} onRetry={() => loadPage(loaded ? 'more' : 'initial')} />
        ) : hasMore ? (
          <div ref={sentinelRef} className="grid place-items-center">
            {loaded && <Spinner label="Cargando más…" />}
          </div>
        ) : (
          items.length > 0 && (
            <p className="text-center text-sm text-slate-600">Fin del feed.</p>
          )
        )}
      </div>
    </section>
  )
}
