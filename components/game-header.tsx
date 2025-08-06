"use client"

import { CustomCard, CustomCardContent } from "@/components/custom-card"
import type { GameMode } from "@/types/game"
import { Clock, Target, Trophy } from "lucide-react"

interface GameHeaderProps {
  moves: number
  time: number
  formatTime: (seconds: number) => string
  mode: GameMode
  timeLimit?: number
  moveLimit?: number
  difficulty: string
  theme: string
}

export default function GameHeader({ 
  moves, 
  time, 
  formatTime, 
  mode, 
  timeLimit, 
  moveLimit, 
  difficulty, 
  theme 
}: GameHeaderProps) {
  const getModeIcon = () => {
    switch (mode) {
      case 'timeAttack':
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
      case 'limitedMoves':
        return <Target className="w-4 h-4 sm:w-5 sm:h-5" />
      default:
        return <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
    }
  }

  const getModeLabel = () => {
    switch (mode) {
      case 'timeAttack':
        return 'Time Attack'
      case 'limitedMoves':
        return 'Limited Moves'
      default:
        return 'Classic'
    }
  }

  const getRemainingInfo = () => {
    switch (mode) {
      case 'timeAttack':
        if (!timeLimit) return null
        const remainingTime = Math.max(0, timeLimit - time)
        return (
          <div className="text-xs sm:text-sm text-red-600 font-semibold">
            Time Left: {formatTime(remainingTime)}
          </div>
        )
      case 'limitedMoves':
        if (!moveLimit) return null
        const remainingMoves = Math.max(0, moveLimit - moves)
        return (
          <div className="text-xs sm:text-sm text-orange-600 font-semibold">
            Moves Left: {remainingMoves}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <CustomCard className="w-full max-w-2xl mb-4 sm:mb-6 bg-white/90 shadow-lg">
      <CustomCardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          {/* Game Info */}
          <div className="flex items-center gap-2 sm:gap-3">
            {getModeIcon()}
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-brainflip-700">
                BrainFlip
              </h1>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                <span className="capitalize">{difficulty}</span>
                <span className="hidden sm:inline">•</span>
                <span>{getModeLabel()}</span>
                <span className="hidden sm:inline">•</span>
                <span className="capitalize">{theme}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-row sm:flex-row items-center gap-3 sm:gap-4 md:gap-6">
            <div className="text-center">
              <div className="text-base sm:text-lg md:text-xl font-bold text-brainflip-600">
                {moves}
              </div>
              <div className="text-xs text-gray-600">Moves</div>
            </div>
            <div className="text-center">
              <div className="text-base sm:text-lg md:text-xl font-bold text-brainflip-600">
                {formatTime(time)}
              </div>
              <div className="text-xs text-gray-600">Time</div>
            </div>
          </div>
        </div>

        {/* Mode-specific info */}
        {getRemainingInfo() && (
          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
            {getRemainingInfo()}
          </div>
        )}
      </CustomCardContent>
    </CustomCard>
  )
}
