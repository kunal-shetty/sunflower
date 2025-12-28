"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import confetti from "canvas-confetti"

const PUZZLES = [
  { word: "FOCUS", hint: "Concentrate on this" },
  { word: "RELAX", hint: "Take it easy" },
  { word: "DREAM", hint: "Sleep vision" },
  { word: "SHINE", hint: "Glow bright" },
  { word: "BLOOM", hint: "Flower action" },
  { word: "CALM", hint: "Stay peaceful" },
  { word: "HOPE", hint: "Positive feeling" },
  { word: "BRAVE", hint: "Courageous" },
]

export default function Zip() {
  const [currentPuzzle, setCurrentPuzzle] = useState(PUZZLES[0])
  const [selectedLetters, setSelectedLetters] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [solvedCount, setSolvedCount] = useState(0)

  const scrambledLetters = currentPuzzle.word.split("").sort(() => Math.random() - 0.5)

  const nextPuzzle = () => {
    const next = PUZZLES[Math.floor(Math.random() * PUZZLES.length)]
    setCurrentPuzzle(next)
    setSelectedLetters([])
  }

  useEffect(() => {
    const word = selectedLetters.map((i) => scrambledLetters[i]).join("")
    if (word === currentPuzzle.word) {
      const newScore = score + 20
      setScore(newScore)
      setSolvedCount(solvedCount + 1)
      if (newScore >= 60 && newScore % 60 === 0) {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } })
      }
      setTimeout(nextPuzzle, 1000)
    }
  }, [selectedLetters])

  const toggleLetter = (index: number) => {
    if (selectedLetters.includes(index)) {
      setSelectedLetters(selectedLetters.filter((i) => i !== index))
    } else {
      setSelectedLetters([...selectedLetters, index])
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-md mx-auto">
      <div className="text-center space-y-1">
        <div className="text-sm font-medium">Score: {score}</div>
        <div className="text-xs text-muted-foreground">Solved: {solvedCount}</div>
      </div>

      <Card className="p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-sm font-medium text-muted-foreground">{currentPuzzle.hint}</div>
          <div className="flex justify-center gap-2 min-h-[3rem]">
            {selectedLetters.map((i) => (
              <div
                key={i}
                className="w-12 h-12 flex items-center justify-center text-2xl font-bold border-2 border-primary rounded"
              >
                {scrambledLetters[i]}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {scrambledLetters.map((letter, i) => (
            <Button
              key={i}
              onClick={() => toggleLetter(i)}
              variant={selectedLetters.includes(i) ? "default" : "outline"}
              className="aspect-square text-xl font-bold"
            >
              {letter}
            </Button>
          ))}
        </div>

        <Button variant="outline" onClick={() => setSelectedLetters([])} className="w-full">
          Clear
        </Button>
      </Card>

      <Button variant="ghost" onClick={nextPuzzle} className="text-sm">
        Skip Puzzle →
      </Button>
    </div>
  )
}
