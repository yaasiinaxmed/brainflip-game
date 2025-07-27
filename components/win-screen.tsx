"use client"

import { CustomCard, CustomCardContent } from "@/components/custom-card" // Updated import
import { CustomButton } from "@/components/custom-button" // Updated import

interface WinScreenProps {
  moves: number
  time: number
  formatTime: (seconds: number) => string
  onRestart: () => void
}

export default function WinScreen({ moves, time, formatTime, onRestart }: WinScreenProps) {
  return (
    <CustomCard className="w-full max-w-md p-8 text-center bg-white shadow-2xl rounded-xl border-brainflip-500 border-4">
      <CustomCardContent className="flex flex-col items-center justify-center p-0">
        <h2 className="text-4xl font-bold text-brainflip mb-4">You Win! 🎉</h2>
        <p className="text-xl text-gray-700 mb-2">
          Total Moves: <span className="font-semibold text-brainflip">{moves}</span>
        </p>
        <p className="text-xl text-gray-700 mb-6">
          Time Taken: <span className="font-semibold text-brainflip">{formatTime(time)}</span>
        </p>
        <CustomButton
          onClick={onRestart}
          className="bg-brainflip hover:bg-brainflip-600 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Restart Game
        </CustomButton>
      </CustomCardContent>
    </CustomCard>
  )
}
