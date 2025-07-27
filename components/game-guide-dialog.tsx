"use client"

import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogDescription,
  CustomDialogHeader,
  CustomDialogTitle,
} from "@/components/custom-dialog" // Updated import
import { CustomButton } from "@/components/custom-button" // Updated import

interface GameGuideDialogProps {
  isOpen: boolean
  onStartGame: () => void
  onOpenChange: (open: boolean) => void
}

export default function GameGuideDialog({ isOpen, onStartGame, onOpenChange }: GameGuideDialogProps) {
  return (
    <CustomDialog open={isOpen} onOpenChange={onOpenChange}>
      <CustomDialogContent className="sm:max-w-[425px] p-6 rounded-lg shadow-xl border-brainflip-500 border-2">
        <CustomDialogHeader>
          <CustomDialogTitle className="text-3xl font-bold text-brainflip-700 mb-2">
            Welcome to BrainFlip! 🧠
          </CustomDialogTitle>
          <CustomDialogDescription className="text-gray-600 text-base">
            Test your memory with this fun flip card game.
          </CustomDialogDescription>
        </CustomDialogHeader>
        <div className="py-4 text-gray-700 space-y-3">
          <p>
            <span className="font-semibold text-brainflip-600">Game Rules:</span>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Match 8 pairs of face-down cards.</li>
            <li>Click a card to flip it and reveal an emoji.</li>
            <li>Find two matching emojis to keep them open.</li>
            <li>If cards don't match, they'll flip back after 1 second.</li>
            <li>Track your moves and time taken to win!</li>
          </ul>
        </div>
        <CustomButton
          onClick={onStartGame}
          className="w-full bg-brainflip-500 hover:bg-brainflip-600 text-white text-lg px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Start Game
        </CustomButton>
      </CustomDialogContent>
    </CustomDialog>
  )
}
