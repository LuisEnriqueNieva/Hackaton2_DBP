import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/apiClient'
import type { SectorStory } from '../../types/api'

interface UseSectorStoryResult {
  data: SectorStory | null
  loading: boolean
  error: string | null
}

export function useSectorStory(sectorId: string | undefined): UseSectorStoryResult {
  const [data, setData] = useState<SectorStory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sectorId) return

    const controller = new AbortController()

    setLoading(true)
    setError(null)

    apiFetch<SectorStory>(`/sectors/${sectorId}/story`, {}, controller.signal)
      .then((response) => {
        setData(response)
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') return
        setError(err.message || 'No se pudo cargar la historia del sector.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [sectorId])

  return { data, loading, error }
}