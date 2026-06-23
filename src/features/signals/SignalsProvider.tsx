import { useCallback, useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import type { Signal } from '../../types/api'
import { EMPTY_SNAPSHOT, SignalsContext } from './signals-context'
import type { FeedSnapshot } from './signals-context'

// Ruta padre de /signals y /signals/:id: conserva el feed acumulado entre ambas.
export function SignalsProvider() {
  const [snapshot, setSnapshot] = useState<FeedSnapshot>(EMPTY_SNAPSHOT)

  const reset = useCallback((key: string) => {
    setSnapshot({ ...EMPTY_SNAPSHOT, key })
  }, [])

  const appendPage = useCallback(
    (items: Signal[], nextCursor: string | null, hasMore: boolean, totalEstimate: number) => {
      setSnapshot((prev) => {
        // Deduplicar por ID al concatenar páginas.
        const seen = new Set(prev.items.map((s) => s.id))
        const fresh = items.filter((s) => !seen.has(s.id))
        return {
          ...prev,
          items: [...prev.items, ...fresh],
          nextCursor,
          hasMore,
          totalEstimate,
          loaded: true,
        }
      })
    },
    [],
  )

  const setScrollY = useCallback((y: number) => {
    setSnapshot((prev) => (prev.scrollY === y ? prev : { ...prev, scrollY: y }))
  }, [])

  const updateSignal = useCallback((updated: Signal) => {
    setSnapshot((prev) => ({
      ...prev,
      items: prev.items.map((s) => (s.id === updated.id ? updated : s)),
    }))
  }, [])

  const value = useMemo(
    () => ({ snapshot, reset, appendPage, setScrollY, updateSignal }),
    [snapshot, reset, appendPage, setScrollY, updateSignal],
  )

  return (
    <SignalsContext.Provider value={value}>
      <Outlet />
    </SignalsContext.Provider>
  )
}
