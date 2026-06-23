import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { isAbortError } from '../../lib/apiClient'
import type { Signal, SignalStatus } from '../../types/api'
import { ErrorState } from '../../components/ErrorState'
import { Spinner } from '../../components/Spinner'
import { SEVERITY_BADGE, STATUS_BADGE } from '../constants'
import { fetchSignal, patchSignalStatus } from './signalsApi'
import { useSignalsContext } from './useSignalsContext'

type TargetStatus = Extract<SignalStatus, 'PROCESANDO' | 'ATENDIDA'>

export function SignalDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { snapshot, updateSignal } = useSignalsContext()

  // Si el feed ya tenía la señal, mostrarla al instante mientras refresca.
  const cached = snapshot.items.find((s) => s.id === id) ?? null
  const [signal, setSignal] = useState<Signal | null>(cached)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(!cached)

  // Estado de la acción PATCH.
  const [updating, setUpdating] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const reloadKey = useRef(0)

  // Cargar/refrescar el detalle real.
  useEffect(() => {
    const controller = new AbortController()
    if (!cached) setLoading(true)
    setLoadError(null)
    fetchSignal(id, controller.signal)
      .then((data) => {
        setSignal(data)
        updateSignal(data)
      })
      .catch((err) => {
        if (isAbortError(err)) return
        // Si no había nada en caché, es un error de carga; si había, conservamos el cache.
        if (!cached) {
          setLoadError(err instanceof Error ? err.message : 'No se pudo cargar la señal.')
        }
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
    // reloadKey permite reintentar manualmente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, reloadKey.current])

  const goBack = useCallback(() => {
    // Vuelve al feed conservando posición (history). Si se entró directo, va al feed.
    if (location.key !== 'default') navigate(-1)
    else navigate('/signals')
  }, [location.key, navigate])

  const changeStatus = useCallback(
    async (status: TargetStatus) => {
      setUpdating(true)
      setActionError(null)
      setConfirmed(false)
      try {
        const updated = await patchSignalStatus(id, status)
        setSignal(updated)
        updateSignal(updated) // refleja el nuevo estado en el feed
        setConfirmed(true)
      } catch (err) {
        setActionError(err instanceof Error ? err.message : 'No se pudo actualizar el estado.')
      } finally {
        setUpdating(false)
      }
    },
    [id, updateSignal],
  )

  return (
    <section className="mx-auto max-w-2xl">
      <button
        type="button"
        onClick={goBack}
        className="mb-4 text-sm text-slate-400 transition-colors hover:text-slate-200"
      >
        ← Volver al feed
      </button>

      {loading && (
        <div className="grid place-items-center py-16">
          <Spinner label="Cargando señal…" />
        </div>
      )}

      {loadError && !signal && (
        <ErrorState
          message={loadError}
          onRetry={() => {
            reloadKey.current += 1
            setLoading(true)
          }}
        />
      )}

      {signal && (
        <article className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">{signal.signalType}</h1>
              <p className="mt-1 text-sm text-slate-400">
                {signal.tropel.name} · {signal.tropel.species}
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${SEVERITY_BADGE[signal.severity]}`}
              >
                {signal.severity}
              </span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[signal.status]}`}
              >
                {signal.status}
              </span>
            </div>
          </div>

          <p className="mt-5 rounded-lg bg-slate-950/40 p-4 text-sm text-slate-200">
            {signal.rawContent}
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-500">
            <div>
              <dt className="uppercase tracking-wide">Creada</dt>
              <dd className="text-slate-300">{new Date(signal.createdAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-wide">Actualizada</dt>
              <dd className="text-slate-300">{new Date(signal.updatedAt).toLocaleString()}</dd>
            </div>
          </dl>

          {/* Acciones de atención */}
          <div className="mt-6 border-t border-slate-800 pt-5">
            <p className="mb-3 text-sm font-medium text-slate-300">Atender señal</p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={updating || signal.status === 'PROCESANDO'}
                onClick={() => changeStatus('PROCESANDO')}
                className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Marcar PROCESANDO
              </button>
              <button
                type="button"
                disabled={updating || signal.status === 'ATENDIDA'}
                onClick={() => changeStatus('ATENDIDA')}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Marcar ATENDIDA
              </button>
              {updating && <Spinner label="Actualizando…" />}
            </div>

            {confirmed && !actionError && (
              <p role="status" className="mt-3 text-sm text-emerald-300">
                ✓ Estado actualizado a {signal.status}.
              </p>
            )}

            {actionError && (
              <div className="mt-3">
                <ErrorState message={actionError} onRetry={() => changeStatus(signal.status === 'RECIBIDA' ? 'PROCESANDO' : 'ATENDIDA')} />
              </div>
            )}
          </div>
        </article>
      )}
    </section>
  )
}
