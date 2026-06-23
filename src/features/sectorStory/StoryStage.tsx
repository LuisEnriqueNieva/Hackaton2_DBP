import { forwardRef } from 'react'
import type { StoryStage as StoryStageData } from '../../types/api'

interface StoryStageProps {
  stage: StoryStageData
  index: number
  isActive: boolean
  scrollDrivenAnimations: boolean
}

export const StoryStage = forwardRef<HTMLElement, StoryStageProps>(
  ({ stage, index, isActive, scrollDrivenAnimations }, ref) => {
    return (
      <section
        ref={ref}
        data-stage-index={index}
        tabIndex={0}
        className={[
          'story-stage',
          isActive ? 'story-stage--active' : '',
          scrollDrivenAnimations ? 'story-stage--native-anim' : 'story-stage--fallback-anim',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-current={isActive ? 'true' : undefined}
      >
        <span className="story-stage__event">{stage.dominantEvent}</span>
        <h3 className="story-stage__title">{stage.title}</h3>
        <p className="story-stage__body">{stage.narrative}</p>
      </section>
    )
  }
)

StoryStage.displayName = 'StoryStage'