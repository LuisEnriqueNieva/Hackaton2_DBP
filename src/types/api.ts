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

// Referencia liviana al Tropel asociado, tal como la devuelve el backend.
export interface SignalTropelRef {
  id: string
  name: string
  species: Species
}

export interface Signal {
  id: string
  signalType: SignalType
  severity: Severity
  status: SignalStatus
  rawContent: string
  tropel: SignalTropelRef
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

export interface StoryStageMetric {
  label: string
  value: number | string
}

export interface StoryStage {
  id: string
  order: number
  title: string
  body: string
  visualKey: string
  metrics: StoryStageMetric[]
}

export interface SectorStory {
  sectorId: string
  sectorName: string
  summary: string
  stages: StoryStage[]
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

// Ordenamientos permitidos por GET /tropels.
export type TropelSort = 'name,asc' | 'updatedAt,desc' | 'chaosIndex,desc'

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

// ---- Sectores (para el filtro por sector) ----
export interface SectorListItem {
  id: string
  sectorCode: string
  name: string
  climate: Climate
  capacity: number
  currentLoad: number
  stabilityLevel: number
}

export interface SectorsResponse {
  items: SectorListItem[]
}