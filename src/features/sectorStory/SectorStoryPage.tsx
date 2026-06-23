import { useParams, useNavigate } from 'react-router-dom'
import { useSectorStory } from './useSectorStory'
import { useActiveStage } from './useActiveStage'
import { useFeatureSupport } from './useScrollDrivenSupport'
import { StoryStage } from './StoryStage'
import { StoryVisualPanel } from './StoryVisualPanel'
import { StoryProgress } from './StoryProgress'
import './sectorStory.css'

export function SectorStoryPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, loading, error } = useSectorStory(id)
  const { scrollDrivenAnimations, reducedMotion } = useFeatureSupport()

  const stages = data?.stages ?? []
  const { activeIndex, registerStage } = useActiveStage(stages.length)

  function handleBack() {
    if ('startViewTransition' in document) {

      document.startViewTransition(() => navigate(`/sectors/${id}`))
    } else {
      navigate(`/sectors/${id}`)
    }
  }

  if (loading) {
    return (
      <div className="story-page story-page--loading" role="status">
        Cargando historia del sector...
      </div>
    )
  }

  if (error) {
    return (
      <div className="story-page story-page--error" role="alert">
        <p>{error}</p>
        <button onClick={handleBack}>Volver</button>
      </div>
    )
  }

  if (!data || stages.length === 0) {
    return (
      <div className="story-page story-page--empty">
        <p>Este sector aún no tiene historia disponible.</p>
        <button onClick={handleBack}>Volver</button>
      </div>
    )
  }

  return (
    <div className="story-page">
      <header className="story-page__header">
        <button onClick={handleBack} aria-label="Volver al resumen del sector">
          ← Volver
        </button>
        <StoryProgress activeIndex={activeIndex} total={stages.length} />
      </header>

      <div className="story-page__layout">
        <StoryVisualPanel stage={stages[activeIndex]} reducedMotion={reducedMotion} />

        <div className="story-page__narrative">
          {stages.map((stage, index) => (
            <StoryStage
              key={stage.id}
              ref={registerStage(index)}
              stage={stage}
              index={index}
              isActive={index === activeIndex}
              scrollDrivenAnimations={scrollDrivenAnimations}
            />
          ))}
        </div>
      </div>
    </div>
  )
}