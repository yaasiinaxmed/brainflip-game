"use client"

import type { CardData } from "@/types/game"
import CardItem from "./card-item"
import { DIFFICULTY_CONFIGS } from "@/lib/constants"
import type { DifficultyLevel } from "@/types/game"

interface GameBoardProps {
  cards: CardData[]
  onCardClick: (card: CardData) => void
  lockBoard: boolean
  difficulty: DifficultyLevel
}

export default function GameBoard({ cards, onCardClick, lockBoard, difficulty }: GameBoardProps) {
  const config = DIFFICULTY_CONFIGS[difficulty]
  const gridCols = config.gridSize

  return (
    <div className={`grid gap-3 sm:gap-4 md:gap-5 py-8 px-4 sm:py-12 sm:px-6 md:py-16 md:px-8 bg-white/80 rounded-xl shadow-2xl max-w-2xl w-full aspect-square mb-8 overflow-hidden`} 
         style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
      {cards.map((card) => (
        <CardItem key={card.id} card={card} onClick={onCardClick} lockBoard={lockBoard} />
      ))}
    </div>
  )
}
