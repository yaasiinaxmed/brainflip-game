"use client"

import { useState } from "react"
import { CustomCard, CustomCardContent } from "@/components/custom-card"
import { CustomButton } from "@/components/custom-button"
import { CustomDialog, CustomDialogContent, CustomDialogHeader, CustomDialogTitle } from "@/components/custom-dialog"
import { DIFFICULTY_CONFIGS, THEME_PACKS } from "@/lib/constants"
import type { DifficultyLevel, GameMode, GameConfig } from "@/types/game"
import { Settings, Play, Clock, Target, Palette, ArrowLeft } from "lucide-react"

interface GameSettingsProps {
  onStartGame: (config: GameConfig) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  currentConfig?: GameConfig
}

export default function GameSettings({ onStartGame, isOpen, onOpenChange, currentConfig }: GameSettingsProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(currentConfig?.difficulty || 'medium')
  const [selectedMode, setSelectedMode] = useState<GameMode>(currentConfig?.mode || 'classic')
  const [selectedTheme, setSelectedTheme] = useState<string>(currentConfig?.theme || 'mixed')

  const handleStartGame = () => {
    const config: GameConfig = {
      difficulty: selectedDifficulty,
      mode: selectedMode,
      theme: selectedTheme,
      timeLimit: selectedMode === 'timeAttack' ? DIFFICULTY_CONFIGS[selectedDifficulty].timeLimit : undefined,
      moveLimit: selectedMode === 'limitedMoves' ? DIFFICULTY_CONFIGS[selectedDifficulty].moveLimit : undefined
    }
    onStartGame(config)
    onOpenChange(false)
  }

  const handleBackToGame = () => {
    onOpenChange(false)
  }

  const getDifficultyDescription = (difficulty: DifficultyLevel) => {
    const config = DIFFICULTY_CONFIGS[difficulty]
    const totalCards = config.gridSize * config.gridSize
    return `${config.gridSize}x${config.gridSize} • ${config.pairs} pairs${config.hasSingle ? ' + 1' : ''}`
  }

  const getModeDescription = (mode: GameMode) => {
    switch (mode) {
      case 'classic':
        return 'Match all pairs to win'
      case 'timeAttack':
        return 'Beat the clock!'
      case 'limitedMoves':
        return 'Complete with limited moves'
      default:
        return ''
    }
  }

  return (
    <CustomDialog open={isOpen} onOpenChange={onOpenChange}>
      <CustomDialogContent className="max-w-sm sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
        <CustomDialogHeader className="pb-4">
          <CustomDialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
            Game Settings
          </CustomDialogTitle>
        </CustomDialogHeader>

        <div className="space-y-6 px-1">
          {/* Difficulty Selection */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-brainflip-700 mb-3">Difficulty</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {(['easy', 'medium', 'hard', 'expert'] as DifficultyLevel[]).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`
                    p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left min-h-[80px] sm:min-h-[90px]
                    ${selectedDifficulty === difficulty
                      ? 'border-brainflip-500 bg-brainflip-50 text-brainflip-700 shadow-md'
                      : 'border-gray-200 bg-white hover:border-brainflip-300 hover:bg-brainflip-25'
                    }
                  `}
                >
                  <div className="font-semibold capitalize text-sm sm:text-base">{difficulty}</div>
                  <div className="text-xs text-gray-600 mt-1 leading-tight">
                    {getDifficultyDescription(difficulty)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Game Mode Selection */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-brainflip-700 mb-3">Game Mode</h3>
            <div className="space-y-2">
              {([
                { mode: 'classic' as GameMode, icon: Play, label: 'Classic' },
                { mode: 'timeAttack' as GameMode, icon: Clock, label: 'Time Attack' },
                { mode: 'limitedMoves' as GameMode, icon: Target, label: 'Limited Moves' }
              ]).map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  className={`
                    w-full p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left flex items-center gap-3 min-h-[60px]
                    ${selectedMode === mode
                      ? 'border-brainflip-500 bg-brainflip-50 text-brainflip-700 shadow-md'
                      : 'border-gray-200 bg-white hover:border-brainflip-300 hover:bg-brainflip-25'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm sm:text-base">{label}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {getModeDescription(mode)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-brainflip-700 mb-3">Theme</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {Object.values(THEME_PACKS).map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`
                    p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left min-h-[80px] sm:min-h-[90px]
                    ${selectedTheme === theme.id
                      ? 'border-brainflip-500 bg-brainflip-50 text-brainflip-700 shadow-md'
                      : 'border-gray-200 bg-white hover:border-brainflip-300 hover:bg-brainflip-25'
                    }
                  `}
                >
                  <div className="font-semibold text-sm sm:text-base">{theme.name}</div>
                  <div className="text-xs text-gray-600 mt-1 leading-tight">
                    {theme.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <CustomButton
              onClick={handleStartGame}
              className="w-full bg-brainflip-500 hover:bg-brainflip-600 text-white py-3 sm:py-4 rounded-lg font-semibold transition-all duration-200 text-base"
            >
              Start New Game
            </CustomButton>
            
            <CustomButton
              onClick={handleBackToGame}
              variant="outline"
              className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 py-3 sm:py-4 rounded-lg transition-all duration-200 text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Game
            </CustomButton>
          </div>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  )
} 