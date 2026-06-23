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