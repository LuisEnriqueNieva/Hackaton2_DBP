import { apiFetch } from '../../lib/apiClient'
import type { Signal, SignalFeedResponse, SignalStatus } from '../../types/api'

export interface SignalFilters {
  signalType?: string
  severity?: string
  status?: string
  q?: string
}

const DEFAULT_LIMIT = 15

// GET /signals/feed — feed cursor-based para infinite scroll.
export function fetchSignalsFeed(
  filters: SignalFilters,
  cursor: string | null,
  signal?: AbortSignal,
  limit = DEFAULT_LIMIT,
): Promise<SignalFeedResponse> {
  const params = new URLSearchParams()
  if (cursor) params.set('cursor', cursor)
  params.set('limit', String(limit))
  if (filters.signalType) params.set('signalType', filters.signalType)
  if (filters.severity) params.set('severity', filters.severity)
  if (filters.status) params.set('status', filters.status)
  if (filters.q) params.set('q', filters.q)
  return apiFetch<SignalFeedResponse>(`/signals/feed?${params.toString()}`, {}, signal)
}

// GET /signals/:id — detalle de una Señal.
export function fetchSignal(id: string, signal?: AbortSignal): Promise<Signal> {
  return apiFetch<Signal>(`/signals/${id}`, {}, signal)
}

// PATCH /signals/:id/status — solo PROCESANDO o ATENDIDA.
export function patchSignalStatus(
  id: string,
  status: Extract<SignalStatus, 'PROCESANDO' | 'ATENDIDA'>,
  signal?: AbortSignal,
): Promise<Signal> {
  return apiFetch<Signal>(
    `/signals/${id}/status`,
    { method: 'PATCH', body: JSON.stringify({ status }) },
    signal,
  )
}

// Firma estable de los filtros: si cambia, el feed se reinicia.
export function signalFilterKey(filters: SignalFilters): string {
  return [filters.signalType ?? '', filters.severity ?? '', filters.status ?? '', filters.q ?? ''].join(
    '|',
  )
}
