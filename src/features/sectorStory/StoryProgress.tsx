interface StoryProgressProps {
  activeIndex: number
  total: number
}

export function StoryProgress({ activeIndex, total }: StoryProgressProps) {
  const percent = total > 0 ? ((activeIndex + 1) / total) * 100 : 0

  return (
    <div
      className="story-progress"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={activeIndex + 1}
      aria-label={`Etapa ${activeIndex + 1} de ${total}`}
    >
      <div className="story-progress__bar" style={{ width: `${percent}%` }} />
      <span className="story-progress__label">
        {activeIndex + 1} / {total}
      </span>
    </div>
  )
}