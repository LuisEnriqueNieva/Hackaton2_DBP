// Opciones de enums para los selectores de filtros (Tropeles y Señales).
import type {
  Severity,
  SignalStatus,
  SignalType,
  Species,
  TropelSort,
  VitalState,
} from '../types/api'

export const SPECIES: Species[] = ['BLOBITO', 'CHISPA', 'GRUNON', 'DORMILON', 'GLITCHY']

export const VITAL_STATES: VitalState[] = [
  'ESTABLE',
  'HAMBRIENTO',
  'AGITADO',
  'MUTANDO',
  'CRITICO',
]

export const SIGNAL_TYPES: SignalType[] = [
  'HAMBRE',
  'ABANDONO',
  'MUTACION',
  'FUGA',
  'CONFLICTO',
  'REPRODUCCION_MASIVA',
  'SENAL_CORRUPTA',
]

export const SEVERITIES: Severity[] = ['LEVE', 'MODERADO', 'GRAVE', 'CRITICO']

export const SIGNAL_STATUSES: SignalStatus[] = ['RECIBIDA', 'PROCESANDO', 'ATENDIDA']

export const TROPEL_SORTS: { value: TropelSort; label: string }[] = [
  { value: 'updatedAt,desc', label: 'Más recientes' },
  { value: 'name,asc', label: 'Nombre (A→Z)' },
  { value: 'chaosIndex,desc', label: 'Mayor caos' },
]

export const PAGE_SIZES = [10, 20, 50] as const

// Clases Tailwind por severidad (reutilizadas en Dashboard/Señales).
export const SEVERITY_BADGE: Record<Severity, string> = {
  LEVE: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  MODERADO: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  GRAVE: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  CRITICO: 'bg-red-500/15 text-red-300 border-red-500/30',
}

export const STATUS_BADGE: Record<SignalStatus, string> = {
  RECIBIDA: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  PROCESANDO: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  ATENDIDA: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
}

export const VITAL_BADGE: Record<VitalState, string> = {
  ESTABLE: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  HAMBRIENTO: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  AGITADO: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  MUTANDO: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
  CRITICO: 'bg-red-500/15 text-red-300 border-red-500/30',
}
