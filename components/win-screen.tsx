'use client'

import { CustomCard, CustomCardContent } from '@/components/custom-card'
import { CustomButton } from '@/components/custom-button'
import { ShareButton } from '@/components/share-button'
import { useState, useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'
import type { GameMode } from '@/types/game'

interface WinScreenProps {
  moves: number
  time: number // time in seconds
  onRestart: () => void
  mode: GameMode
  timeLimit?: number
  moveLimit?: number
  difficulty: string
  theme: string
}

export default function WinScreen({ 
  moves, 
  time, 
  onRestart, 
  mode, 
  timeLimit, 
  moveLimit, 
  difficulty, 
  theme 
}: WinScreenProps) {
  const [user, setUser] = useState<any>(null)

  // Internal time formatter
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}minutes ${secs}seconds`
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const context = await sdk.context
        if (context?.user?.fid) {
          const res = await fetch('/api/user-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fid: context.user.fid }),
          })
          const data = await res.json()
          setUser(data)
        }
      } catch (err) {
        console.error('User Fetch Error:', err)
      }
    }
    fetchUser()
  }, [])

  const getWinMessage = () => {
    switch (mode) {
      case 'timeAttack':
        if (timeLimit) {
          const timeLeft = timeLimit - time
          return `You beat the clock with ${formatTime(timeLeft)} remaining!`
        }
        return 'You completed the time attack!'
      case 'limitedMoves':
        if (moveLimit) {
          const movesLeft = moveLimit - moves
          return `You completed it with ${movesLeft} moves to spare!`
        }
        return 'You completed the limited moves challenge!'
      default:
        return 'You matched all the pairs!'
    }
  }

  const getModeIcon = () => {
    switch (mode) {
      case 'timeAttack':
        return '⏰'
      case 'limitedMoves':
        return '🎯'
      default:
        return '🏆'
    }
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

  const shareText = `🎉 Just won BrainFlip ${getModeText()} (${difficulty}) in ${moves} moves and ${formatTime(time)}! Can you beat my score? 🧠`

  return (
    <CustomCard className="w-full max-w-md p-8 text-center bg-white shadow-2xl rounded-xl border-brainflip-500 border-4">
      <CustomCardContent className="flex flex-col items-center justify-center p-0">
        <div className="text-6xl mb-4">{getModeIcon()}</div>
        <h2 className="text-4xl font-bold text-brainflip-700 mb-2">You Win! 🎉</h2>
        <p className="text-lg text-gray-600 mb-4">{getWinMessage()}</p>

        {user && (
          <div className="flex items-center gap-2 mb-4">
            <img
              src={user.pfp_url}
              alt={user.display_name || user.username}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-lg font-semibold text-brainflip-600">
              {user.display_name || user.username}
            </span>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4 mb-6 w-full">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-gray-700">Mode</div>
              <div className="text-brainflip-600 capitalize">{getModeText()}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">Difficulty</div>
              <div className="text-brainflip-600 capitalize">{difficulty}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">Moves</div>
              <div className="text-brainflip-600">{moves}</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">Time</div>
              <div className="text-brainflip-600">{formatTime(time)}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <CustomButton
            onClick={onRestart}
            className="bg-brainflip-500 hover:bg-brainflip-600 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Play Again
          </CustomButton>

          {user && (
            <ShareButton
              buttonText="Share Win on Farcaster"
              cast={{
                text: shareText,
                embeds: ['https://farcaster.xyz/miniapps/5SFQ1gqzf5sW/brainflip']
              }}
              className="w-full bg-brainflip-500 text-white hover:bg-brainflip-600 text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            />
          )}
        </div>
      </CustomCardContent>
    </CustomCard>
  )
}
