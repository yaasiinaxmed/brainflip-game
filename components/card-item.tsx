"use client"

import { CustomCard, CustomCardContent } from "@/components/custom-card"
import type { CardData } from "@/types/game"

interface CardItemProps {
  card: CardData
  onClick: (card: CardData) => void
  lockBoard: boolean
}

export default function CardItem({ card, onClick, lockBoard }: CardItemProps) {
  return (
    <div key={card.id} className="relative w-full h-full perspective-1000">
      <button
        onClick={() => onClick(card)}
        className={`
          w-full h-full rounded-lg shadow-md transition-all duration-500 ease-in-out transform-gpu
          preserve-3d backface-hidden
          flex items-center justify-center /* Added flexbox for centering */
          ${card.isFlipped || card.isMatched ? "rotate-y-180" : ""}
          ${!card.isFlipped && !card.isMatched ? "hover:scale-105 hover:shadow-xl" : ""}
          ${lockBoard && !(card.isFlipped || card.isMatched) ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
        `}
        disabled={lockBoard || card.isFlipped || card.isMatched}
        aria-label={card.isFlipped || card.isMatched ? `Card showing ${card.emoji}` : "Face down card"}
      >
        {/* Card Front (Face Down) */}
        <CustomCard
          className={`
            absolute w-full h-full rounded-lg flex items-center justify-center
            bg-brainflip text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold
            transition-all duration-500 ease-in-out
            ${card.isFlipped || card.isMatched ? "opacity-0" : "opacity-100"}
          `}
        >
          <CustomCardContent className="p-2 sm:p-4">
            {" "}
            {/* Restored padding */}
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">❓</span>
          </CustomCardContent>
        </CustomCard>

        {/* Card Back (Face Up - Emoji) */}
        <CustomCard
          className={`
            absolute w-full h-full rounded-lg flex items-center justify-center
            bg-white text-brainflip-700 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold
            transition-all duration-500 ease-in-out
            rotate-y-180
            ${card.isFlipped || card.isMatched ? "opacity-100" : "opacity-0"}
          `}
        >
          <CustomCardContent className="p-2 sm:p-4">
            {" "}
            {/* Restored padding */}
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">{card.emoji}</span>
          </CustomCardContent>
        </CustomCard>
      </button>
    </div>
  )
}
