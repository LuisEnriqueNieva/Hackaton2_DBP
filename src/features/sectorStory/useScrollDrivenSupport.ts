import { useMemo } from 'react'

interface FeatureSupport {
  scrollDrivenAnimations: boolean
  viewTransitions: boolean
  reducedMotion: boolean
}

export function useFeatureSupport(): FeatureSupport {
  return useMemo(() => {
    const scrollDrivenAnimations =
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('animation-timeline: scroll()')

    const viewTransitions =
      typeof document !== 'undefined' && 'startViewTransition' in document

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    return { scrollDrivenAnimations, viewTransitions, reducedMotion }
  }, [])
}