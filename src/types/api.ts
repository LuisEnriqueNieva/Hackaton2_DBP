export interface Sector {
  id: string
  name: string
  sectorCode: string
}

export interface Tropel {
  id: string
  name: string
  species: 'BLOBITO' | 'CHISPA' | 'GRUNON' | 'DORMILON' | 'GLITCHY'
  vitalState: 'ESTABLE' | 'HAMBRIENTO' | 'AGITADO' | 'MUTANDO' | 'CRITICO'
  energyLevel: number
  chaosIndex: number
  mutationStage: number
  guardianName: string
  sector: Sector
  createdAt: string
  updatedAt: string
}

export interface TropelPage {
  content: Tropel[]
  totalElements: number
  totalPages: number
  currentPage: number
  size: number
}

export interface Signal {
  id: string
  tropelId: string
  signalType: 'HAMBRE' | 'ABANDONO' | 'MUTACION' | 'FUGA' | 'CONFLICTO' | 'REPRODUCCION_MASIVA' | 'SENAL_CORRUPTA'
  severity: 'LEVE' | 'MODERADO' | 'GRAVE' | 'CRITICO'
  status: 'RECIBIDA' | 'PROCESANDO' | 'ATENDIDA'
  rawContent: string
  createdAt: string
  updatedAt: string
}

export interface SignalFeedResponse {
  items: Signal[]
  nextCursor: string | null
  hasMore: boolean
  totalEstimate: number
}

export interface ApiError {
  error: string
  message: string
  timestamp: string
  path: string
  details: Record<string, unknown>
}

// ---- Enums nombrados (reutilizables por toda la app) ----
export type Species = 'BLOBITO' | 'CHISPA' | 'GRUNON' | 'DORMILON' | 'GLITCHY'
export type VitalState = 'ESTABLE' | 'HAMBRIENTO' | 'AGITADO' | 'MUTANDO' | 'CRITICO'
export type SignalType =
  | 'HAMBRE'
  | 'ABANDONO'
  | 'MUTACION'
  | 'FUGA'
  | 'CONFLICTO'
  | 'REPRODUCCION_MASIVA'
  | 'SENAL_CORRUPTA'
export type Severity = 'LEVE' | 'MODERADO' | 'GRAVE' | 'CRITICO'
export type SignalStatus = 'RECIBIDA' | 'PROCESANDO' | 'ATENDIDA'
export type Climate = 'PIXEL_FOREST' | 'NEON_CAVE' | 'CLOUD_AQUARIUM' | 'RETRO_ARCADE'

// ---- Auth ----
export interface User {
  id: string
  displayName: string
  email: string
  teamCode: string
  role: string
}

export interface LoginRequest {
  teamCode: string
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  expiresAt: string
  user: User
}

// ---- Dashboard ----
export interface DashboardSummary {
  totalTropels: number
  criticalTropels: number
  openSignals: number
  sectorStabilityAvg: number
  signalsBySeverity: Record<Severity, number>
  generatedAt: string
}