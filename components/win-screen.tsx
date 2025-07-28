'use client'

import { CustomCard, CustomCardContent } from '@/components/custom-card'
import { CustomButton } from '@/components/custom-button'
import { useState, useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

interface WinScreenProps {
  moves: number
  time: number // time in seconds
  onRestart: () => void
}

export default function WinScreen({ moves, time, onRestart }: WinScreenProps) {
  const [user, setUser] = useState<any>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [isSDKReady, setIsSDKReady] = useState(false)

  // Internal time formatter
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}minutes ${secs}seconds`
  }

  useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready()
        setIsSDKReady(true)

        const context = await sdk.context
        if (context?.user?.fid) {
          fetchUser(context.user.fid)
        }
      } catch (err) {
        console.error('SDK Init Error:', err)
      }
    }
    init()
  }, [])

  const fetchUser = async (fid: number) => {
    try {
      const res = await fetch('/api/user-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fid }),
      })
      const data = await res.json()
      setUser(data)
    } catch (err) {
      console.error('User Fetch Error:', err)
    }
  }

  const shareWin = async () => {
    if (!user || !isSDKReady) return
    setIsSharing(true)

    try {
      const text = `🎉 Just won BrainFlip in ${moves} moves and ${formatTime(time)}! Can you beat my score? https://farcaster.xyz/miniapps/5SFQ1gqzf5sW/brainflip`

      await sdk.actions.openUrl(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`
      )

      sdk.actions.showToast('Share opened in composer!')
    } catch (err) {
      console.error('Share Error:', err)
      sdk.actions.showToast('Failed to share.')
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <CustomCard className="w-full max-w-md p-8 text-center bg-white shadow-2xl rounded-xl border-brainflip-500 border-4">
      <CustomCardContent className="flex flex-col items-center justify-center p-0">
        <h2 className="text-4xl font-bold text-brainflip-700 mb-4">You Win! 🎉</h2>

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

        <p className="text-xl text-gray-700 mb-2">
          Total Moves:{' '}
          <span className="font-semibold text-brainflip-600">{moves}</span>
        </p>
        <p className="text-xl text-gray-700 mb-6">
          Time Taken:{' '}
          <span className="font-semibold text-brainflip-600">{formatTime(time)}</span>
        </p>

        <div className="flex flex-col gap-4 w-full">
          <CustomButton
            onClick={onRestart}
            className="bg-brainflip-500 hover:bg-brainflip-600 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Restart Game
          </CustomButton>

          {user && isSDKReady && (
            <CustomButton
              onClick={shareWin}
              disabled={isSharing}
              className="w-full bg-brainflip-500 text-white hover:bg-brainflip-600 text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              {isSharing ? 'Sharing...' : 'Share Win on Farcaster'}
            </CustomButton>
          )}
        </div>
      </CustomCardContent>
    </CustomCard>
  )
}
