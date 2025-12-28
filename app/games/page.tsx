"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import TileFlip from "@/components/games/TileFlip"
import WordScramble from "@/components/games/WordScramble"
import NumberMatch from "@/components/games/NumberMatch"
import BreathingCircle from "@/components/games/BreathingCircle"
import ColorMatch from "@/components/games/ColorMatch"
import Zip from "@/components/games/Zip"
import PathConnect from "@/components/games/PathConnect"

type GameKey = "home" | "tile" | "word" | "number" | "breathe" | "color" | "zip" | "path"

export default function GamesHome() {
  const [activeGame, setActiveGame] = useState<GameKey>("home")

  if (activeGame !== "home") {
    return (
      <div className="flex flex-col h-full">
        {/* Top bar */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Button variant="outline" size="sm" onClick={() => setActiveGame("home")}>
            ← Back
          </Button>
        </div>

        {/* Game area */}
        <div className="flex-1 overflow-y-auto">
          {activeGame === "tile" && <TileFlip />}
          {activeGame === "word" && <WordScramble />}
          {activeGame === "number" && <NumberMatch />}
          {activeGame === "breathe" && <BreathingCircle />}
          {activeGame === "color" && <ColorMatch />}
          {activeGame === "zip" && <Zip />}
          {activeGame === "path" && <PathConnect />}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">Take a Break</h1>
        <p className="text-sm text-muted-foreground">Simple games to relax your mind 🌻</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        <GameCard title="Tile Flip" icon="🧩" subtitle="Memory · Combos" onClick={() => setActiveGame("tile")} />

        <GameCard title="Word Scramble" icon="📝" subtitle="Words · Quick" onClick={() => setActiveGame("word")} />

        <GameCard title="Number Match" icon="🔢" subtitle="Math · Fast" onClick={() => setActiveGame("number")} />

        <GameCard title="Breathing" icon="🌬️" subtitle="Calm · Relax" onClick={() => setActiveGame("breathe")} />

        <GameCard title="Color Match" icon="🎨" subtitle="Colors · Focus" onClick={() => setActiveGame("color")} />

        <GameCard title="Zip" icon="🔤" subtitle="Word Puzzle" onClick={() => setActiveGame("zip")} />

        <GameCard title="Path Connect" icon="🔗" subtitle="Logic · Flow" onClick={() => setActiveGame("path")} />
      </div>
    </div>
  )
}

function GameCard({
  title,
  icon,
  subtitle,
  onClick,
}: {
  title: string
  icon: string
  subtitle: string
  onClick: () => void
}) {
  return (
    <Card
      onClick={onClick}
      className="aspect-square p-4 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all active:scale-[0.96]"
    >
      <div className="text-4xl">{icon}</div>

      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </Card>
  )
}
