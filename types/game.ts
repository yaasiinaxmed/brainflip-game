export interface CardData {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert'

export type GameMode = 'classic' | 'timeAttack' | 'limitedMoves'

export interface GameConfig {
  difficulty: DifficultyLevel
  mode: GameMode
  theme: string
  timeLimit?: number // for time attack mode
  moveLimit?: number // for limited moves mode
}

export interface ThemePack {
  id: string
  name: string
  emojis: string[]
  description: string
}

export interface GameStats {
  moves: number
  time: number
  score: number
  difficulty: DifficultyLevel
  mode: GameMode
  theme: string
}
