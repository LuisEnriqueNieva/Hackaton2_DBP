import { useNavigate, useParams } from 'react-router-dom'
import { useSectorStory } from './useSectorStory'
import './sectorStory.css'

// Resumen del sector: la contraparte de la historia para la View Transition
// "resumen ↔ historia" (Checkpoint 5). Desde aquí se entra al scrollytelling.
export function SectorSummaryPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, loading, error } = useSectorStory(id)

  function openStory() {
    const go = () => navigate(`/sectors/${id}/story`)
    if ('startViewTransition' in document) document.startViewTransition(go)
    else go()
  }

  if (loading) {
    return (
      <div className="story-page story-page--loading" role="status">
        Cargando sector…
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="story-page story-page--error" role="alert">
        <p>{error ?? 'No se pudo cargar el sector.'}</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    )
  }

  const { sector, stages } = data

  return (
    <div className="sector-summary">
      <p className="sector-summary__climate">{sector.climate}</p>
      <h1 className="sector-summary__title">{sector.name}</h1>
      <p className="sector-summary__meta">
        {stages.length} etapas · sector {sector.id}
      </p>

      <button type="button" className="sector-summary__cta" onClick={openStory}>
        Ver historia completa →
      </button>
    </div>
  )
}
