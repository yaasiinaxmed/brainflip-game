"use client"

import Image from "next/image"
import { CustomBadge } from "@/components/custom-badge"

interface GameHeaderProps {
  moves: number
  time: number
  formatTime: (seconds: number) => string
}

export default function GameHeader({ moves, time, formatTime }: GameHeaderProps) {
  return (
    <>
      <h1 className="text-5xl sm:text-6xl font-extrabold text-brainflip mb-6 drop-shadow-lg text-center flex items-center justify-center gap-3">
        <Image
          src="/icon.png" // must be placed in `public/logo.png`
          alt="BrainFlip Logo"
          width={48}
          height={48}
          className="inline-block"
        />
        BrainFlip
      </h1>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 w-full max-w-md">
        <CustomBadge className="bg-brainflip text-white text-lg px-4 py-2 rounded-full shadow-md flex-1 justify-center">
          Moves: {moves}
        </CustomBadge>
        <CustomBadge className="bg-brainflip text-white text-lg px-4 py-2 rounded-full shadow-md flex-1 justify-center">
          Time: {formatTime(time)}
        </CustomBadge>
      </div>
    </>
  )
}
