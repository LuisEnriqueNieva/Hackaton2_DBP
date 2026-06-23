import { apiFetch } from '../../lib/apiClient'
import type { SectorsResponse, TropelPage } from '../../types/api'

export interface TropelQuery {
  page: number
  size: number
  sort: string
  species?: string
  vitalState?: string
  sectorId?: string
  q?: string
}

// GET /tropels — paginación real del servidor con filtros combinables.
export function fetchTropels(query: TropelQuery, signal?: AbortSignal): Promise<TropelPage> {
  const params = new URLSearchParams()
  params.set('page', String(query.page))
  params.set('size', String(query.size))
  params.set('sort', query.sort)
  if (query.species) params.set('species', query.species)
  if (query.vitalState) params.set('vitalState', query.vitalState)
  if (query.sectorId) params.set('sectorId', query.sectorId)
  if (query.q) params.set('q', query.q)
  return apiFetch<TropelPage>(`/tropels?${params.toString()}`, {}, signal)
}

// GET /sectors — lista para el filtro por sector.
export function fetchSectors(signal?: AbortSignal): Promise<SectorsResponse> {
  return apiFetch<SectorsResponse>('/sectors', {}, signal)
}
