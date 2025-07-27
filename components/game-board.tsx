"use client"

import type { CardData } from "@/types/game"
import CardItem from "./card-item"

interface GameBoardProps {
  cards: CardData[]
  onCardClick: (card: CardData) => void
  lockBoard: boolean
}

export default function GameBoard({ cards, onCardClick, lockBoard }: GameBoardProps) {
  return (
    <div className="grid grid-cols-4 gap-5 sm:gap-8 py-12 px-5 sm:py-16 sm:px-8 bg-white/80 rounded-xl shadow-2xl max-w-2xl w-full aspect-square mb-8 overflow-hidden">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} onClick={onCardClick} lockBoard={lockBoard} />
      ))}
    </div>
  )
}
