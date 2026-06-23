import type { Tropel } from '../../types/api'
import { VITAL_BADGE } from '../constants'

// Tarjeta de un Tropel en el atlas.
export function TropelCard({ tropel }: { tropel: Tropel }) {
  return (
    <article className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-100">{tropel.name}</h3>
          <p className="text-xs text-slate-400">{tropel.species}</p>
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${VITAL_BADGE[tropel.vitalState]}`}
        >
          {tropel.vitalState}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Metric label="Energía" value={tropel.energyLevel} />
        <Metric label="Caos" value={tropel.chaosIndex} />
        <Metric label="Mutación" value={tropel.mutationStage} />
      </dl>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>{tropel.sector.name}</span>
        <span>Guardián: {tropel.guardianName}</span>
      </div>
    </article>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-slate-900/40 py-2">
      <dt className="text-[10px] uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="text-lg font-semibold tabular-nums text-slate-200">{value}</dd>
    </div>
  )
}
