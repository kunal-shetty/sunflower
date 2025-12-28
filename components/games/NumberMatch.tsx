"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"

export default function NumberMatch() {
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [target, setTarget] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameOver, setGameOver] = useState(false)

  const generateProblem = () => {
    const a = Math.floor(Math.random() * 20) + 1
    const b = Math.floor(Math.random() * 20) + 1
    setNum1(a)
    setNum2(b)
    setTarget(a + b)
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

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      const bonus = 10 + streak * 2
      const newScore = score + bonus
      setScore(newScore)
      setStreak(streak + 1)
      if (newScore >= 50 && newScore % 50 === 0) {
        confetti({ particleCount: 30, spread: 40, origin: { y: 0.6 } })
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
          <div className="text-5xl">🎯</div>
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

  const wrongAnswer = target + Math.floor(Math.random() * 10) + 1
  const options = [target, wrongAnswer].sort(() => Math.random() - 0.5)

  return (
    <div className="flex flex-col gap-6 p-6 max-w-md mx-auto">
      <div className="flex justify-between text-sm font-medium">
        <span>
          Score: {score} {streak > 1 && <span className="text-primary">×{streak}</span>}
        </span>
        <span>Time: {timeLeft}s</span>
      </div>

      <Card className="p-8 text-center space-y-6">
        <div className="text-5xl font-bold text-primary">
          {num1} + {num2}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {options.map((opt) => (
            <Button key={opt} onClick={() => handleAnswer(opt === target)} className="text-2xl h-20" variant="outline">
              {opt}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  )
}
