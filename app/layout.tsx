import * as React from 'react'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'


const fcMiniAppContent = JSON.stringify({
  version: "1",
  imageUrl: "https://brainflip-game.vercel.app/og-image.png",
  button: {
    title: "Test your memory",
    action: {
      type: "launch_miniapp",
      name: "BrainFlip",
      url: "https://brainflip-game.vercel.app/",
      splashImageUrl: "https://brainflip-game.vercel.app/icon.png",
      splashBackgroundColor: "#000000"
    }
  }
})

const fcFrameContent = JSON.stringify({
  version: "1",
  imageUrl: "https://brainflip-game.vercel.app/og-image.png",
  button: {
    title: "Test your memory",
    action: {
      type: "launch_frame",
      name: "BrainFlip",
      url: "https://brainflip-game.vercel.app/",
      splashImageUrl: "https://brainflip-game.vercel.app/icon.png",
      splashBackgroundColor: "#000000"
    }
  }
})

export const metadata: Metadata = {
  title: 'BrainFlip - Test your memory. Flip, match, win.',
  description: 'A simple memory game to challenge your brain—flip cards, find pairs, and beat your best score.',
  other: [
    { name: 'fc:miniapp', content: fcMiniAppContent },
    { name: 'fc:frame', content: fcFrameContent },
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" style={{ fontFamily: GeistSans.style.fontFamily }}>
      <body>
        {children}
      </body>
    </html>
  )
}