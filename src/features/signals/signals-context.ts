import { createContext } from 'react'
import type { Signal } from '../../types/api'

// Estado acumulado del feed. Vive en el provider (ruta padre), así sobrevive
// a la navegación hacia el detalle y de vuelta sin recargar ni perder scroll.
export interface FeedSnapshot {
  key: string
  items: Signal[]
  nextCursor: string | null
  hasMore: boolean
  totalEstimate: number
  scrollY: number
  loaded: boolean
}

export interface SignalsContextValue {
  snapshot: FeedSnapshot
  reset: (key: string) => void
  appendPage: (
    items: Signal[],
    nextCursor: string | null,
    hasMore: boolean,
    totalEstimate: number,
  ) => void
  setScrollY: (y: number) => void
  updateSignal: (signal: Signal) => void
}

export const EMPTY_SNAPSHOT: FeedSnapshot = {
  key: '',
  items: [],
  nextCursor: null,
  hasMore: true,
  totalEstimate: 0,
  scrollY: 0,
  loaded: false,
}

export const SignalsContext = createContext<SignalsContextValue | null>(null)
