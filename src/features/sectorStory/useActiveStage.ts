import { useEffect, useRef, useState } from 'react'

export function useActiveStage(stageCount: number) {
  const [activeIndex, setActiveIndex] = useState(0)
  const stageRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    stageRefs.current = new Array(stageCount).fill(null)
  }, [stageCount])

  useEffect(() => {
    if (stageCount === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        let bestIndex: number | null = null
        let bestDistance = Infinity

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const index = Number(entry.target.getAttribute('data-stage-index'))
          const rect = entry.boundingClientRect
          const viewportCenter = window.innerHeight / 2
          const elementCenter = rect.top + rect.height / 2
          const distance = Math.abs(elementCenter - viewportCenter)

          if (distance < bestDistance) {
            bestDistance = distance
            bestIndex = index
          }
        })

        if (bestIndex !== null) {
          setActiveIndex(bestIndex)
        }
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
      }
    )

    stageRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [stageCount])

  const registerStage = (index: number) => (el: HTMLElement | null) => {
    stageRefs.current[index] = el
  }

  return { activeIndex, registerStage }
}