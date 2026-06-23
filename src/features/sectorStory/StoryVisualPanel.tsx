import type { CSSProperties } from 'react'
import type { StoryStage } from '../../types/api'

interface StoryVisualPanelProps {
  stage: StoryStage | undefined
  reducedMotion: boolean
}

// colorToken (ej. "emerald") → color CSS. El visual se construye con CSS, no con
// imágenes/video. Fallback a un gris neutro si el token es desconocido.
const COLOR_TOKENS: Record<string, string> = {
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  fuchsia: '#d946ef',
  rose: '#f43f5e',
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  lime: '#84cc16',
  slate: '#64748b',
}

function colorFor(token: string): string {
  return COLOR_TOKENS[token] ?? '#64748b'
}

export function StoryVisualPanel({ stage, reducedMotion }: StoryVisualPanelProps) {
  if (!stage) {
    return <div className="story-visual-panel story-visual-panel--empty" aria-hidden="true" />
  }

  const color = colorFor(stage.colorToken)
  const style = {
    '--stage-color': color,
    background: `radial-gradient(circle at 30% 20%, color-mix(in srgb, ${color} 30%, #0b1120), #0b1120)`,
  } as CSSProperties

  return (
    <aside
      className={`story-visual-panel ${
        reducedMotion ? 'story-visual-panel--static' : 'story-visual-panel--animated'
      }`}
      data-visual-key={stage.assetKey}
      data-color-token={stage.colorToken}
      style={style}
      aria-live="polite"
    >
      {/* Visual construido íntegramente con CSS, temático por colorToken/assetKey */}
      <div className="story-visual-panel__scene" aria-hidden="true">
        <span className="story-visual-panel__orb" />
      </div>

      <span className="story-visual-panel__event">{stage.dominantEvent}</span>
      <h2 className="story-visual-panel__title">{stage.title}</h2>

      <ul className="story-visual-panel__metrics">
        <li>
          <span className="story-visual-panel__metric-label">Estabilidad</span>
          <span className="story-visual-panel__metric-value">{stage.metrics.stability}</span>
        </li>
        <li>
          <span className="story-visual-panel__metric-label">Energía</span>
          <span className="story-visual-panel__metric-value">{stage.metrics.energy}</span>
        </li>
        <li>
          <span className="story-visual-panel__metric-label">Alertas</span>
          <span className="story-visual-panel__metric-value">{stage.metrics.alerts}</span>
        </li>
      </ul>
    </aside>
  )
}
