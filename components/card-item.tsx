"use client"

import { useState, useEffect } from "react"
import type { CardData } from "@/types/game"

interface CardItemProps {
  card: CardData
  onClick: (card: CardData) => void
  lockBoard: boolean
}

export default function CardItem({ card, onClick, lockBoard }: CardItemProps) {
  const [isFlipping, setIsFlipping] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Handle card flip animation
  useEffect(() => {
    if (card.isFlipped && !isFlipping) {
      setIsFlipping(true)
      setTimeout(() => setIsFlipping(false), 700)
    }
  }, [card.isFlipped, isFlipping])

  const handleClick = () => {
    if (!lockBoard && !card.isFlipped && !card.isMatched) {
      onClick(card)
    }
  }

  const handleMouseEnter = () => {
    if (!card.isFlipped && !card.isMatched && !lockBoard) {
      setIsHovering(true)
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  return (
    <div className="relative w-full h-full perspective-1000">
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          w-full h-full rounded-lg shadow-lg transition-all duration-700 ease-in-out transform-gpu
          preserve-3d backface-hidden relative
          flex items-center justify-center
          ${card.isFlipped || card.isMatched ? "rotate-y-180" : ""}
          ${isHovering ? "animate-card-hover" : ""}
          ${lockBoard && !(card.isFlipped || card.isMatched) ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
          ${card.isMatched ? "animate-card-glow" : ""}
        `}
        disabled={lockBoard || card.isFlipped || card.isMatched}
        aria-label={card.isFlipped || card.isMatched ? `Card showing ${card.emoji}` : "Face down card"}
        style={{
          transformStyle: 'preserve-3d',
          transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Card Front (Face Down) */}
        <div
          className={`
            absolute w-full h-full rounded-lg flex items-center justify-center
            bg-gradient-to-br from-brainflip-500 to-brainflip-600 text-white
            text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold
            transition-all duration-700 ease-in-out
            shadow-lg border-2 border-brainflip-400
            ${card.isFlipped || card.isMatched ? "opacity-0" : "opacity-100"}
          `}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          <div className="p-2 sm:p-4">
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">❓</span>
          </div>
        </div>

        {/* Card Back (Face Up - Emoji) */}
        <div
          className={`
            absolute w-full h-full rounded-lg flex items-center justify-center
            bg-gradient-to-br from-white to-gray-50 text-brainflip-700
            text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold
            transition-all duration-700 ease-in-out
            shadow-lg border-2 border-gray-200
            ${card.isFlipped || card.isMatched ? "opacity-100" : "opacity-0"}
            ${card.isMatched ? "bg-gradient-to-br from-green-100 to-green-200 border-green-300" : ""}
          `}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="p-2 sm:p-4">
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">{card.emoji}</span>
          </div>
        </div>

        {/* 3D Shadow Effect */}
        <div
          className={`
            absolute inset-0 rounded-lg pointer-events-none
            transition-all duration-700 ease-in-out
            ${card.isFlipped || card.isMatched ? "shadow-2xl" : "shadow-lg"}
            ${card.isMatched ? "shadow-green-500/50" : "shadow-gray-500/30"}
          `}
          style={{
            transform: 'translateZ(-1px)',
          }}
        />

        {/* Card Edge Effect */}
        <div
          className={`
            absolute inset-0 rounded-lg pointer-events-none
            border-2 border-gray-300/20
            transition-all duration-700 ease-in-out
            ${card.isFlipped || card.isMatched ? "border-gray-400/40" : ""}
          `}
          style={{
            transform: 'translateZ(1px)',
          }}
        />
      </button>
    </div>
  )
}
