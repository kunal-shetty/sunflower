"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"

const LEVELS = [
  {
    size: 5,
    colors: [
      { color: "#ef4444", start: [0, 0], end: [4, 4] },
      { color: "#3b82f6", start: [0, 4], end: [4, 0] },
    ],
  },
  {
    size: 5,
    colors: [
      { color: "#ef4444", start: [0, 0], end: [4, 4] },
      { color: "#3b82f6", start: [1, 1], end: [3, 3] },
      { color: "#22c55e", start: [0, 4], end: [4, 0] },
    ],
  },
]

export default function PathConnect() {
  const [level, setLevel] = useState(0)
  const [paths, setPaths] = useState<{ [key: string]: [number, number][] }>({})
  const [currentColor, setCurrentColor] = useState<string | null>(null)
  const [score, setScore] = useState(0)

  const currentLevel = LEVELS[level % LEVELS.length]

  const isCellConnected = (row: number, col: number) => {
    for (const [color, path] of Object.entries(paths)) {
      if (path.some(([r, c]) => r === row && c === col)) {
        return color
      }
    }
    return null
  }

  const isEndPoint = (row: number, col: number) => {
    return currentLevel.colors.find(
      (c) => (c.start[0] === row && c.start[1] === col) || (c.end[0] === row && c.end[1] === col),
    )
  }

  const handleCellClick = (row: number, col: number) => {
    const endpoint = isEndPoint(row, col)
    if (endpoint) {
      setCurrentColor(endpoint.color)
      setPaths({ ...paths, [endpoint.color]: [[row, col]] })
    } else if (currentColor) {
      const path = paths[currentColor] || []
      setPaths({ ...paths, [currentColor]: [...path, [row, col]] })
    }
  }

  const checkSolved = () => {
    const allConnected = currentLevel.colors.every((c) => {
      const path = paths[c.color]
      if (!path) return false
      return (
        (path[0][0] === c.start[0] &&
          path[0][1] === c.start[1] &&
          path[path.length - 1][0] === c.end[0] &&
          path[path.length - 1][1] === c.end[1]) ||
        (path[0][0] === c.end[0] &&
          path[0][1] === c.end[1] &&
          path[path.length - 1][0] === c.start[0] &&
          path[path.length - 1][1] === c.start[1])
      )
    })

    if (allConnected) {
      const newScore = score + 30
      setScore(newScore)
      if (newScore >= 60 && newScore % 60 === 0) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } })
      }
      setTimeout(() => {
        setLevel(level + 1)
        setPaths({})
        setCurrentColor(null)
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Level {level + 1}</span>
        <span className="text-sm font-medium">Score: {score}</span>
      </div>

      <Card className="p-4">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${currentLevel.size}, 1fr)` }}>
          {Array.from({ length: currentLevel.size * currentLevel.size }).map((_, i) => {
            const row = Math.floor(i / currentLevel.size)
            const col = i % currentLevel.size
            const connectedColor = isCellConnected(row, col)
            const endpoint = isEndPoint(row, col)

            return (
              <div
                key={i}
                onClick={() => handleCellClick(row, col)}
                className="aspect-square border rounded flex items-center justify-center cursor-pointer"
                style={{
                  backgroundColor: connectedColor || (endpoint ? endpoint.color : "transparent"),
                }}
              >
                {endpoint && <div className="w-3 h-3 rounded-full bg-white" />}
              </div>
            )
          })}
        </div>
      </Card>

      <div className="flex gap-2">
        <Button onClick={() => setPaths({})} variant="outline" className="flex-1">
          Clear
        </Button>
        <Button onClick={checkSolved} className="flex-1">
          Check
        </Button>
      </div>
    </div>
  )
}
