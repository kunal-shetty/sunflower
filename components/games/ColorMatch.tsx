"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"

const COLORS = [
  { name: "RED", hex: "#ef4444" },
  { name: "BLUE", hex: "#3b82f6" },
  { name: "GREEN", hex: "#22c55e" },
  { name: "YELLOW", hex: "#eab308" },
  { name: "PURPLE", hex: "#a855f7" },
  { name: "ORANGE", hex: "#f97316" },
]

export default function ColorMatch() {
  const [colorName, setColorName] = useState("")
  const [displayColor, setDisplayColor] = useState("")
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameOver, setGameOver] = useState(false)

  const generateProblem = () => {
    const name = COLORS[Math.floor(Math.random() * COLORS.length)]
    const display = COLORS[Math.floor(Math.random() * COLORS.length)]
    setColorName(name.name)
    setDisplayColor(display.hex)
  }

  useEffect(() => {
    generateProblem()
  }, [])

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true)
      return
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const handleAnswer = (match: boolean) => {
    const nameColor = COLORS.find((c) => c.name === colorName)
    const isMatch = nameColor?.hex === displayColor

    if ((match && isMatch) || (!match && !isMatch)) {
      const bonus = 10 + streak * 2
      const newScore = score + bonus
      setScore(newScore)
      setStreak(streak + 1)
      if (newScore >= 50 && newScore % 50 === 0) {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } })
      }
    } else {
      setStreak(0)
    }
    generateProblem()
  }

  const restart = () => {
    setScore(0)
    setStreak(0)
    setTimeLeft(30)
    setGameOver(false)
    generateProblem()
  }

  if (gameOver) {
    return (
      <div className="flex items-center justify-center p-6">
        <Card className="p-8 text-center space-y-6 max-w-sm">
          <div className="text-5xl">🎨</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Time's Up!</h2>
            <p className="text-lg">Final Score: {score}</p>
          </div>
          <Button onClick={restart} className="w-full">
            Play Again
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-md mx-auto">
      <div className="flex justify-between text-sm font-medium">
        <span>
          Score: {score} {streak > 1 && <span className="text-primary">×{streak}</span>}
        </span>
        <span>Time: {timeLeft}s</span>
      </div>

      <Card className="p-8 text-center space-y-6">
        <div className="text-sm font-medium text-muted-foreground">Does the word match the color?</div>
        <div className="text-5xl font-bold" style={{ color: displayColor }}>
          {colorName}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => handleAnswer(true)} className="h-20 text-xl" variant="outline">
            Match ✓
          </Button>
          <Button onClick={() => handleAnswer(false)} className="h-20 text-xl" variant="outline">
            No Match ✗
          </Button>
        </div>
      </Card>
    </div>
  )
}
