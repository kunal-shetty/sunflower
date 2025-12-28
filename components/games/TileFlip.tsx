"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import confetti from "canvas-confetti"

/* 🌻 Cute, calm, repeat-safe emojis */
const ALL_EMOJIS = [
  "🌻","🌸","🌼","🌷","🪷","💐","🪴","🍃",
  "✨","⭐","🌈","🌙","☁️",
  "💛","💖","💗","🤍","💫"
]

/* 🔢 Progressive EVEN grids only */
const GRID_LEVELS = [
  { rows: 3, cols: 4 }, // 12
  { rows: 4, cols: 4 }, // 16
  { rows: 4, cols: 5 }, // 20
  { rows: 5, cols: 6 }, // 30
  { rows: 6, cols: 6 }, // 36
  { rows: 6, cols: 7 }, // 42
  { rows: 7, cols: 8 }, // 56
  { rows: 8, cols: 8 }, // 64
]

export default function TileFlip() {
  const [level, setLevel] = useState(1)
  const [tiles, setTiles] = useState<string[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [locked, setLocked] = useState(false)
  const [showLevelComplete, setShowLevelComplete] = useState(false)

  const grid =
    GRID_LEVELS[Math.min(level - 1, GRID_LEVELS.length - 1)]

  const totalTiles = grid.rows * grid.cols
  const pairs = totalTiles / 2

  /* 🔄 Setup board safely */
  useEffect(() => {
    const selected = Array.from(
      { length: pairs },
      (_, i) => ALL_EMOJIS[i % ALL_EMOJIS.length]
    )

    const shuffled = [...selected, ...selected].sort(
      () => Math.random() - 0.5
    )

    setTiles(shuffled)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setCombo(0)
    setLocked(false)
    setShowLevelComplete(false)
  }, [level])

  /* 🃏 Flip logic */
  const flipTile = (index: number) => {
    if (locked) return
    if (flipped.length === 2) return
    if (flipped.includes(index) || matched.includes(index)) return

    const next = [...flipped, index]
    setFlipped(next)

    if (next.length === 2) {
      setLocked(true)
      setMoves((m) => m + 1)

      const [a, b] = next

      if (tiles[a] === tiles[b]) {
        const bonus = 20 + combo * 10
        setMatched((m) => [...m, a, b])
        setScore((s) => s + bonus)
        setCombo((c) => c + 1)

        setTimeout(() => {
          setFlipped([])
          setLocked(false)
        }, 450)
      } else {
        setCombo(0)
        setTimeout(() => {
          setFlipped([])
          setLocked(false)
        }, 750)
      }
    }
  }

  /* 🎉 Level completed */
  useEffect(() => {
    if (tiles.length && matched.length === tiles.length) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.7 },
      })

      setTimeout(() => {
        setShowLevelComplete(true)
      }, 800)
    }
  }, [matched, tiles])

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between text-sm font-medium">
        <span>Level {level}</span>
        <span>{grid.rows}×{grid.cols}</span>
      </div>

      {/* Grid */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)` }}
      >
        {tiles.map((emoji, i) => {
          const isOpen = flipped.includes(i) || matched.includes(i)

          return (
            <div
              key={i}
              onClick={() => flipTile(i)}
              className="perspective"
            >
              <div
                className={`relative w-full aspect-square transition-transform duration-500 transform-style-preserve-3d ${
                  isOpen ? "rotate-y-180" : ""
                }`}
              >
                {/* Front */}
                <Card className="absolute inset-0 backface-hidden bg-primary/10" />

                {/* Back */}
                <Card className="absolute inset-0 flex items-center justify-center text-3xl backface-hidden rotate-y-180 bg-muted">
                  {emoji}
                </Card>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom stats */}
      <div className="flex items-center justify-between text-sm font-medium">
        <span>Moves {moves}</span>
        <span className="text-base">
          Score {score}
          {combo > 1 && (
            <span className="ml-1 text-primary">×{combo}</span>
          )}
        </span>
      </div>

      {/* 🌻 Level Complete Modal */}
      {showLevelComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <Card className="w-full max-w-sm p-6 space-y-4 text-center animate-in fade-in zoom-in-95">
            <div className="text-4xl">🌻</div>

            <h2 className="text-lg font-semibold">
              Level Complete!
            </h2>

            <p className="text-sm text-muted-foreground">
              Nice focus. Ready for the next one?
            </p>

            <div className="flex gap-3">
              <Card
                className="flex-1 p-3 text-sm cursor-pointer hover:bg-muted transition"
                onClick={() => {
                  setShowLevelComplete(false)
                  setLevel((l) => l + 1)
                }}
              >
                Continue →
              </Card>

              <Card
                className="flex-1 p-3 text-sm cursor-pointer hover:bg-muted transition"
                onClick={() => {
                  setShowLevelComplete(false)
                }}
              >
                Exit
              </Card>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
