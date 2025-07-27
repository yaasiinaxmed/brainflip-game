"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ALL_EMOJIS } from "@/lib/constants"
import type { CardData } from "@/types/game"

import GameHeader from "@/components/game-header"
import GameBoard from "@/components/game-board"
import WinScreen from "@/components/win-screen"
import GameGuideDialog from "@/components/game-guide-dialog"
import { sdk } from '@farcaster/miniapp-sdk'

export default function BrainFlipGame() {
  const [cards, setCards] = useState<CardData[]>([])
  const [flippedCards, setFlippedCards] = useState<CardData[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [showGuide, setShowGuide] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const lockBoard = useRef(false)

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      await sdk.actions.ready();
      setIsLoaded(true);
    };
    if (sdk && !isLoaded) {
      load();
    }
  }, [isLoaded]);

  const initializeGame = useCallback(() => {
    const selectedEmojis = ALL_EMOJIS.sort(() => Math.random() - 0.5).slice(0, 8)
    const gameEmojis = [...selectedEmojis, ...selectedEmojis]
    const shuffledEmojis = gameEmojis.sort(() => Math.random() - 0.5)

    const initialCards: CardData[] = shuffledEmojis.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }))

    setCards(initialCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setTime(0)
    setGameStarted(false)
    setGameOver(false)
    lockBoard.current = false
    setShowGuide(false)

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!showGuide) {
      initializeGame()
    }
  }, [initializeGame, showGuide])

  useEffect(() => {
    if (gameStarted && !gameOver) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [gameStarted, gameOver])

  useEffect(() => {
    if (matchedPairs === cards.length / 2 && cards.length > 0) {
      setGameOver(true)
      setGameStarted(false)
    }
  }, [matchedPairs, cards.length])

  const handleCardClick = (clickedCard: CardData) => {
    if (lockBoard.current || clickedCard.isFlipped || clickedCard.isMatched) {
      return
    }

    if (!gameStarted) {
      setGameStarted(true)
    }

    setCards((prevCards) => prevCards.map((card) => (card.id === clickedCard.id ? { ...card, isFlipped: true } : card)))

    setFlippedCards((prevFlipped) => {
      const newFlipped = [...prevFlipped, clickedCard]

      if (newFlipped.length === 2) {
        lockBoard.current = true
        setMoves((prevMoves) => prevMoves + 1)

        const [firstCard, secondCard] = newFlipped

        if (firstCard.emoji === secondCard.emoji) {
          setMatchedPairs((prevPairs) => prevPairs + 1)
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCard.id || card.id === secondCard.id ? { ...card, isMatched: true } : card,
            ),
          )
          setFlippedCards([])
          lockBoard.current = false
        } else {
          setTimeout(() => {
            setCards((prevCards) =>
              prevCards.map((card) =>
                card.id === firstCard.id || card.id === secondCard.id ? { ...card, isFlipped: false } : card,
              ),
            )
            setFlippedCards([])
            lockBoard.current = false
          }, 1000)
        }
      }
      return newFlipped
    })
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-brainflip-50 to-brainflip-100 p-4 sm:p-6 md:p-8">
      <GameHeader moves={moves} time={time} formatTime={formatTime} />

      {gameOver ? (
        <WinScreen moves={moves} time={time} formatTime={formatTime} onRestart={initializeGame} />
      ) : (
        <GameBoard cards={cards} onCardClick={handleCardClick} lockBoard={lockBoard.current} />
      )}

      <GameGuideDialog isOpen={showGuide} onStartGame={initializeGame} onOpenChange={setShowGuide} />
    </div>
  )
}
