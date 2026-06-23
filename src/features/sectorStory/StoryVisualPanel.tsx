import type { StoryStage } from '../../types/api'

interface StoryVisualPanelProps {
  stage: StoryStage | undefined
  reducedMotion: boolean
}

export function StoryVisualPanel({ stage, reducedMotion }: StoryVisualPanelProps) {
  if (!stage) {
    return <div className="story-visual-panel story-visual-panel--empty" aria-hidden="true" />
  }

  return (
    <aside
      className={`story-visual-panel ${
        reducedMotion ? 'story-visual-panel--static' : 'story-visual-panel--animated'
      }`}
      data-visual-key={stage.visualKey}
      aria-live="polite"
    >
      <h2 className="story-visual-panel__title">{stage.title}</h2>
      <ul className="story-visual-panel__metrics">
        {stage.metrics.map((metric) => (
          <li key={metric.label}>
            <span className="story-visual-panel__metric-label">{metric.label}</span>
            <span className="story-visual-panel__metric-value">{metric.value}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}