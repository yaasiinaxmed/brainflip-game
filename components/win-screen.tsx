"use client"

import { CustomCard, CustomCardContent } from "@/components/custom-card"
import { CustomButton } from "@/components/custom-button"
import { useState, useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

interface WinScreenProps {
  moves: number
  time: number
  formatTime: (seconds: number) => string
  onRestart: () => void
}

export default function WinScreen({ moves, time, formatTime, onRestart }: WinScreenProps) {
  const [user, setUser] = useState<any>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [isSDKReady, setIsSDKReady] = useState(false)
  const [context, setContext] = useState<any>(null)

  // Initialize SDK and get context
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        await sdk.actions.ready()
        setIsSDKReady(true)
        
        // Get the mini app context
        const miniAppContext = await sdk.context
        setContext(miniAppContext)
        
        // If we have user info in context, fetch full user data
        if (miniAppContext?.user?.fid) {
          fetchUserData(miniAppContext.user.fid)
        }
      } catch (error) {
        console.error('Error initializing SDK:', error)
      }
    }

    initializeSDK()
  }, [])

  const fetchUserData = async (fid: number) => {
    try {
      const response = await fetch('/api/user-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fid })
      })
      const userData = await response.json()
      setUser(userData)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const shareWinResult = async () => {
    if (!user || !isSDKReady) return
    setIsSharing(true)

    try {
      // Generate share image with user info and game results
      const shareImageResponse = await fetch('/api/generate-share-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username || user.display_name,
          pfpUrl: user.pfp_url,
          moves,
          time: formatTime(time),
          gameResult: 'win'
        })
      })

      const { imageUrl } = await shareImageResponse.json()

      // Use SDK to open composer with pre-filled content
      const shareText = `🎉 Just won BrainFlip in ${moves} moves and ${formatTime(time)}! Can you beat my score?`
      
      // Option 1: Use SDK's share functionality if available
      try {
        await sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(imageUrl)}`)
      } catch (sdkError) {
        // Option 2: Fallback to API call for publishing cast
        const castResponse = await fetch('/api/publish-cast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: shareText,
            embeds: [{ url: imageUrl }],
            userFid: user.fid,
            mentions: []
          })
        })

        if (castResponse.ok) {
          console.log('✅ Successfully shared win result!')
          // Show success feedback to user
          sdk.actions.showToast('Shared successfully!')
        }
      }
    } catch (error) {
      console.error('Error sharing result:', error)
      // Show error feedback to user
      sdk.actions.showToast('Failed to share. Please try again.')
    } finally {
      setIsSharing(false)
    }
  }

  const fallbackShareMessage = `I just won BrainFlip in ${moves} moves and ${formatTime(time)}! Can you beat my score? 👉 https://farcaster.xyz/miniapps/5SFQ1gqzf5sW/brainflip`
  const composeUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(fallbackShareMessage)}`

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
          Total Moves: <span className="font-semibold text-brainflip-600">{moves}</span>
        </p>
        <p className="text-xl text-gray-700 mb-6">
          Time Taken: <span className="font-semibold text-brainflip-600">{formatTime(time)}</span>
        </p>

        <div className="flex flex-col gap-4 w-full">
          <CustomButton
            onClick={onRestart}
            className="bg-brainflip-500 hover:bg-brainflip-600 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Restart Game
          </CustomButton>

          {user && isSDKReady ? (
            <CustomButton 
              onClick={shareWinResult}
              disabled={isSharing}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
            >
              {isSharing ? 'Sharing...' : '🎉 Share Win on Farcaster'}
            </CustomButton>
          ) : (
            <a href={composeUrl} target="_blank" rel="noopener noreferrer" className="w-full">
              <CustomButton className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                Share Win on Farcaster
              </CustomButton>
            </a>
          )}
        </div>
      </CustomCardContent>
    </CustomCard>
  )
}