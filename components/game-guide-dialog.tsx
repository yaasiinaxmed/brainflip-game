"use client"

import { CustomDialog, CustomDialogContent, CustomDialogHeader, CustomDialogTitle } from "@/components/custom-dialog"
import { CustomButton } from "@/components/custom-button"
import { CustomCard, CustomCardContent } from "@/components/custom-card"
import { Brain, Play, Clock, Target, Palette, Settings } from "lucide-react"

interface GameGuideDialogProps {
  isOpen: boolean
  onStartGame: () => void
  onOpenChange: (open: boolean) => void
}

export default function GameGuideDialog({ isOpen, onStartGame, onOpenChange }: GameGuideDialogProps) {
  return (
    <CustomDialog open={isOpen} onOpenChange={onOpenChange}>
      <CustomDialogContent className="max-w-sm sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
        <CustomDialogHeader className="pb-4">
          <CustomDialogTitle className="flex items-center gap-2 text-center text-lg sm:text-xl">
            <Brain className="w-6 h-6 text-brainflip-600" />
            Welcome to BrainFlip!
          </CustomDialogTitle>
        </CustomDialogHeader>

        <div className="space-y-6 px-1">
          {/* How to Play */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-brainflip-700 mb-3">How to Play</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-brainflip-100 rounded-full flex items-center justify-center text-brainflip-600 font-bold text-xs mt-0.5 flex-shrink-0">
                  1
                </div>
                <p className="leading-relaxed">Flip cards to find matching pairs</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-brainflip-100 rounded-full flex items-center justify-center text-brainflip-600 font-bold text-xs mt-0.5 flex-shrink-0">
                  2
                </div>
                <p className="leading-relaxed">Match all pairs to win the game</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-brainflip-100 rounded-full flex items-center justify-center text-brainflip-600 font-bold text-xs mt-0.5 flex-shrink-0">
                  3
                </div>
                <p className="leading-relaxed">Try to complete with fewer moves and faster time!</p>
              </div>
            </div>
          </div>

          {/* Game Features */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-brainflip-700 mb-3">Game Features</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                <Play className="w-4 h-4 text-brainflip-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Classic Mode</span>
              </div>
              <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                <Clock className="w-4 h-4 text-brainflip-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Time Attack</span>
              </div>
              <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                <Target className="w-4 h-4 text-brainflip-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Limited Moves</span>
              </div>
              <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                <Palette className="w-4 h-4 text-brainflip-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm">Theme Packs</span>
              </div>
            </div>
          </div>

          {/* Settings Info */}
          <div className="bg-brainflip-50 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings className="w-4 h-4 text-brainflip-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-brainflip-700">Customize Your Game</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Click the settings icon in the top-right corner to change difficulty, game mode, and themes!
            </p>
          </div>

          {/* Start Button */}
          <CustomButton
            onClick={onStartGame}
            className="w-full bg-brainflip-500 hover:bg-brainflip-600 text-white py-3 sm:py-4 rounded-lg font-semibold transition-all duration-200 text-base"
          >
            Start Playing!
          </CustomButton>
        </div>
      </CustomDialogContent>
    </CustomDialog>
  )
}
