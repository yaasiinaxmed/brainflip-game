"use client"

import { CustomCard, CustomCardContent } from "@/components/custom-card"
import { CustomButton } from "@/components/custom-button"

interface WinScreenProps {
  moves: number
  time: number
  formatTime: (seconds: number) => string
  onRestart: () => void
}

export default function WinScreen({ moves, time, formatTime, onRestart }: WinScreenProps) {
  const shareMessage = `I just won BrainFlip in ${moves} moves and ${formatTime(time)}! Can you beat my score? 👉 https://farcaster.xyz/miniapps/5SFQ1gqzf5sW/brainflip`
  const composeUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareMessage)}`

  return (
    <CustomCard className="w-full max-w-md p-8 text-center bg-white shadow-2xl rounded-xl border-brainflip-500 border-4">
      <CustomCardContent className="flex flex-col items-center justify-center p-0">
        <h2 className="text-4xl font-bold text-brainflip-700 mb-4">You Win! 🎉</h2>
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
          <a href={composeUrl} target="_blank" rel="noopener noreferrer" className="w-full">
            <CustomButton className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300 text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
              Share Win on Farcaster
            </CustomButton>
          </a>
        </div>
      </CustomCardContent>
    </CustomCard>
  )
}
