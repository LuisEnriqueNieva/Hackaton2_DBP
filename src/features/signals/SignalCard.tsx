import { Link } from 'react-router-dom'
import type { Signal } from '../../types/api'
import { SEVERITY_BADGE, STATUS_BADGE } from '../constants'

// Tarjeta de Señal en el feed. Enlaza al detalle conservando el historial.
export function SignalCard({ signal }: { signal: Signal }) {
  return (
    <Link
      to={`/signals/${signal.id}`}
      className="block rounded-xl border border-slate-700/60 bg-slate-800/40 p-4 transition-colors hover:border-slate-600 hover:bg-slate-800/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-slate-100">{signal.signalType}</span>
        <div className="flex gap-2">
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${SEVERITY_BADGE[signal.severity]}`}
          >
            {signal.severity}
          </span>
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[signal.status]}`}
          >
            {signal.status}
          </span>
        </div>
      </div>

      <p className="mt-2 line-clamp-2 text-sm text-slate-300">{signal.rawContent}</p>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>
          {signal.tropel.name} · {signal.tropel.species}
        </span>
        <span>{new Date(signal.createdAt).toLocaleString()}</span>
      </div>
    </Link>
  )
}
