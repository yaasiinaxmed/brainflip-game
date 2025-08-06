'use client'

import { CustomCard, CustomCardContent } from '@/components/custom-card'
import { CustomButton } from '@/components/custom-button'
import { ShareButton } from '@/components/share-button'
import type { GameMode } from '@/types/game'
import { Clock, Target, XCircle } from 'lucide-react'

interface GameOverScreenProps {
  moves: number
  time: number
  formatTime: (seconds: number) => string
  onRestart: () => void
  mode: GameMode
  timeLimit?: number
  moveLimit?: number
  difficulty: string
  theme: string
  matchedPairs: number
  totalPairs: number
}

export default function GameOverScreen({ 
  moves, 
  time, 
  formatTime, 
  onRestart, 
  mode, 
  timeLimit, 
  moveLimit, 
  difficulty, 
  theme, 
  matchedPairs,
  totalPairs
}: GameOverScreenProps) {
  const getFailureMessage = () => {
    switch (mode) {
      case 'timeAttack':
        return 'Time\'s up! You ran out of time.'
      case 'limitedMoves':
        return 'No more moves! You used all your moves.'
      default:
        return 'Game Over!'
    }
  }

  const getModeIcon = () => {
    switch (mode) {
      case 'timeAttack':
        return <Clock className="w-8 h-8 text-red-500" />
      case 'limitedMoves':
        return <Target className="w-8 h-8 text-orange-500" />
      default:
        return <XCircle className="w-8 h-8 text-red-500" />
    }
  }

  const getProgressMessage = () => {
    const percentage = Math.round((matchedPairs / totalPairs) * 100)
    return `You matched ${matchedPairs} out of ${totalPairs} pairs (${percentage}%)`
  }

  const getModeText = () => {
    switch (mode) {
      case 'timeAttack':
        return 'Time Attack'
      case 'limitedMoves':
        return 'Limited Moves'
      default:
        return 'Classic'
    }
  }

  const shareText = `🧠 Tried BrainFlip ${getModeText()} (${difficulty}) - got ${matchedPairs}/${totalPairs} pairs in ${formatTime(time)}! Can you do better?`

  return (
    <CustomCard className="w-full max-w-md p-8 text-center bg-white shadow-2xl rounded-xl border-red-500 border-4">
      <CustomCardContent className="flex flex-col items-center justify-center p-0">
        <div className="mb-4">
          {getModeIcon()}
        </div>
        <h2 className="text-4xl font-bold text-red-600 mb-2">Game Over</h2>
        <p className="text-lg text-gray-600 mb-4">{getFailureMessage()}</p>
        <p className="text-md text-gray-500 mb-6">{getProgressMessage()}</p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 w-full">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-gray-700">Mode</div>
              <div className="text-red-600 capitalize">
                {getModeText()}
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">Difficulty</div>
              <div className="text-red-600 capitalize">{difficulty}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">Moves</div>
              <div className="text-red-600">{moves}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">Time</div>
              <div className="text-red-600">{formatTime(time)}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <CustomButton
            onClick={onRestart}
            className="bg-red-500 hover:bg-red-600 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Try Again
          </CustomButton>

          <ShareButton
            buttonText="Share Challenge on Farcaster"
            cast={{
              text: shareText,
              embeds: ['https://farcaster.xyz/miniapps/5SFQ1gqzf5sW/brainflip']
            }}
            className="w-full bg-red-500 text-white hover:bg-red-600 text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          />
        </div>
      </CustomCardContent>
    </CustomCard>
  )
} 