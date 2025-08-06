"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { DIFFICULTY_CONFIGS, THEME_PACKS } from "@/lib/constants"
import type { CardData, GameConfig, DifficultyLevel, GameMode } from "@/types/game"

import GameHeader from "@/components/game-header"
import GameBoard from "@/components/game-board"
import WinScreen from "@/components/win-screen"
import GameOverScreen from "@/components/game-over-screen"
import GameGuideDialog from "@/components/game-guide-dialog"
import GameSettings from "@/components/game-settings"
import { sdk } from '@farcaster/miniapp-sdk'
import { Settings } from "lucide-react"

export default function BrainFlipGame() {
  const [cards, setCards] = useState<CardData[]>([])
  const [flippedCards, setFlippedCards] = useState<CardData[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [showGuide, setShowGuide] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    difficulty: 'medium',
    mode: 'classic',
    theme: 'mixed'
  })
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

  const initializeGame = useCallback((config?: GameConfig) => {
    const currentConfig = config || gameConfig
    setGameConfig(currentConfig)
    
    const difficultyConfig = DIFFICULTY_CONFIGS[currentConfig.difficulty]
    const themePack = THEME_PACKS[currentConfig.theme as keyof typeof THEME_PACKS]
    
    // Fallback to mixed theme if the selected theme doesn't exist
    if (!themePack) {
      console.warn(`Theme "${currentConfig.theme}" not found, falling back to mixed theme`)
      currentConfig.theme = 'mixed'
    }
    
    const finalThemePack = themePack || THEME_PACKS.mixed
    
    // Select emojis based on difficulty and theme
    const availableEmojis = finalThemePack.emojis
    
    // Ensure we have enough emojis for the selected difficulty
    if (availableEmojis.length < difficultyConfig.pairs) {
      console.warn(`Not enough emojis in theme "${currentConfig.theme}" for ${difficultyConfig.pairs} pairs, using mixed theme`)
      const mixedEmojis = THEME_PACKS.mixed.emojis
      const selectedEmojis = mixedEmojis
        .sort(() => Math.random() - 0.5)
        .slice(0, difficultyConfig.pairs)
      
      // Create pairs
      let gameEmojis = [...selectedEmojis, ...selectedEmojis]
      
      // Add single card if needed
      if (difficultyConfig.hasSingle) {
        const singleEmoji = mixedEmojis
          .filter(emoji => !selectedEmojis.includes(emoji))
          .sort(() => Math.random() - 0.5)[0]
        gameEmojis.push(singleEmoji)
      }
      
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
      setGameWon(false)
      lockBoard.current = false
      setShowGuide(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }
    
    const selectedEmojis = availableEmojis
      .sort(() => Math.random() - 0.5)
      .slice(0, difficultyConfig.pairs)
    
    // Create pairs
    let gameEmojis = [...selectedEmojis, ...selectedEmojis]
    
    // Add single card if needed
    if (difficultyConfig.hasSingle) {
      const singleEmoji = availableEmojis
        .filter(emoji => !selectedEmojis.includes(emoji))
        .sort(() => Math.random() - 0.5)[0]
      gameEmojis.push(singleEmoji)
    }
    
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
    setGameWon(false)
    lockBoard.current = false
    setShowGuide(false)

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [gameConfig])

  useEffect(() => {
    if (!showGuide && !gameOver) {
      initializeGame()
    }
  }, [showGuide, gameOver, initializeGame])

  useEffect(() => {
    if (gameStarted && !gameOver) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1
          
          // Check for time attack mode failure
          if (gameConfig.mode === 'timeAttack' && gameConfig.timeLimit && newTime >= gameConfig.timeLimit) {
            setGameOver(true)
            setGameWon(false)
            setGameStarted(false)
          }
          
          return newTime
        })
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
  }, [gameStarted, gameOver, gameConfig])

  useEffect(() => {
    const totalPairs = DIFFICULTY_CONFIGS[gameConfig.difficulty].pairs
    if (matchedPairs === totalPairs && cards.length > 0) {
      setGameOver(true)
      setGameWon(true)
      setGameStarted(false)
    }
  }, [matchedPairs, cards.length, gameConfig.difficulty])

  const handleCardClick = (clickedCard: CardData) => {
    if (lockBoard.current || clickedCard.isFlipped || clickedCard.isMatched) {
      return
    }

    if (!gameStarted) {
      setGameStarted(true)
    }

    // Check for limited moves mode failure
    if (gameConfig.mode === 'limitedMoves' && gameConfig.moveLimit && moves >= gameConfig.moveLimit) {
      setGameOver(true)
      setGameWon(false)
      setGameStarted(false)
      return
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

  const handleRestart = () => {
    setShowGuide(true)
  }

  const handleSettingsChange = (newConfig: GameConfig) => {
    setGameConfig(newConfig)
    initializeGame(newConfig)
  }

  const totalPairs = DIFFICULTY_CONFIGS[gameConfig.difficulty].pairs

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-brainflip-50 to-brainflip-100 p-4 sm:p-6 md:p-8">
      {!showGuide && !gameOver && (
        <GameHeader 
          moves={moves} 
          time={time} 
          formatTime={formatTime}
          mode={gameConfig.mode}
          timeLimit={gameConfig.timeLimit}
          moveLimit={gameConfig.moveLimit}
          difficulty={gameConfig.difficulty}
          theme={gameConfig.theme}
        />
      )}

      {gameOver ? (
        gameWon ? (
          <WinScreen 
            moves={moves} 
            time={time} 
            formatTime={formatTime} 
            onRestart={handleRestart}
            mode={gameConfig.mode}
            timeLimit={gameConfig.timeLimit}
            moveLimit={gameConfig.moveLimit}
            difficulty={gameConfig.difficulty}
            theme={gameConfig.theme}
          />
        ) : (
          <GameOverScreen 
            moves={moves} 
            time={time} 
            formatTime={formatTime} 
            onRestart={handleRestart}
            mode={gameConfig.mode}
            timeLimit={gameConfig.timeLimit}
            moveLimit={gameConfig.moveLimit}
            difficulty={gameConfig.difficulty}
            theme={gameConfig.theme}
            matchedPairs={matchedPairs}
            totalPairs={totalPairs}
          />
        )
      ) : !showGuide ? (
        <GameBoard 
          cards={cards} 
          onCardClick={handleCardClick} 
          lockBoard={lockBoard.current}
          difficulty={gameConfig.difficulty}
        />
      ) : null}

      {/* Settings Button */}
      {!showGuide && !gameOver && (
        <button
          onClick={() => setShowSettings(true)}
          className="fixed top-4 right-4 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
          aria-label="Game Settings"
        >
          <Settings className="w-6 h-6 text-brainflip-600" />
        </button>
      )}

      <GameGuideDialog 
        isOpen={showGuide} 
        onStartGame={() => initializeGame()} 
        onOpenChange={setShowGuide} 
      />

      <GameSettings 
        isOpen={showSettings} 
        onOpenChange={setShowSettings} 
        onStartGame={handleSettingsChange}
        currentConfig={gameConfig}
      />
    </div>
  )
}
