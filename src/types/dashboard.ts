export type DashboardBadgeState = 'desbloqueado' | 'pendente' | 'disponivel'
export type DashboardMissionState = 'em_andamento' | 'concluida' | 'pendente'
export type DashboardTrackStatus = 'ativo' | 'recente' | 'concluido'

export interface DashboardUser {
  id: string
  nome: string
  nivel: number
  xpAtual: number
  xpMeta: number
  moedas: number
  avatarUrl?: string
  programa: string
}

export interface DashboardBadge {
  id: string
  nome: string
  categoria: string
  descricao?: string
  estado: DashboardBadgeState
  progresso: number
  icone: string
}

export interface DashboardMission {
  id: string
  titulo: string
  progresso: number
  recompensaXp: number
  estado: DashboardMissionState
  tipo: string
}

export interface DashboardTrack {
  id: string
  nome: string
  moduloAtual: number
  totalModulos: number
  progresso: number
  categoria: string
  status: DashboardTrackStatus
  icone: string
  descricao: string
}

export interface DashboardData {
  usuario: DashboardUser
  badges: DashboardBadge[]
  missoes: DashboardMission[]
  trilhas: DashboardTrack[]
}
