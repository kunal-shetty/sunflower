"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import confetti from "canvas-confetti"

const WORDS = [
  "FOCUS",
  "PEACE",
  "RELAX",
  "HAPPY",
  "SMILE",
  "DREAM",
  "SHINE",
  "BLOOM",
  "LIGHT",
  "CLEAR",
  "CALM",
  "BRAVE",
  "KIND",
  "HOPE",
]

export default function WordScramble() {
  const [currentWord, setCurrentWord] = useState("")
  const [scrambled, setScrambled] = useState("")
  const [guess, setGuess] = useState("")
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [feedback, setFeedback] = useState("")

  const scrambleWord = (word: string) => {
    return word
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("")
  }

  const newWord = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)]
    setCurrentWord(word)
    setScrambled(scrambleWord(word))
    setGuess("")
    setFeedback("")
  }

  useEffect(() => {
    newWord()
  }, [])

  const checkGuess = () => {
    if (guess.toUpperCase() === currentWord) {
      const bonus = 10 + streak * 5
      const newScore = score + bonus
      setScore(newScore)
      setStreak(streak + 1)
      setFeedback("✨ Correct!")
      if (newScore >= 50 && newScore % 50 === 0) {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } })
      }
      setTimeout(newWord, 1200)
    } else {
      setStreak(0)
      setFeedback("Try again!")
      setTimeout(() => setFeedback(""), 1500)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <div className="text-sm font-medium text-muted-foreground">
          Score: {score} {streak > 1 && <span className="text-primary">×{streak}</span>}
        </div>
      </div>

      <Card className="p-8 text-center space-y-6">
        <div className="text-sm font-medium text-muted-foreground">Unscramble this word</div>
        <div className="text-4xl font-bold tracking-widest text-primary">{scrambled}</div>

        <div className="space-y-3">
          <Input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkGuess()}
            placeholder="Type your answer"
            className="text-center text-lg"
            autoFocus
          />
          <Button onClick={checkGuess} className="w-full">
            Submit
          </Button>
        </div>

        {feedback && (
          <div
            className={`text-sm font-medium ${feedback.includes("Correct") ? "text-primary" : "text-muted-foreground"}`}
          >
            {feedback}
          </div>
        )}
      </Card>

      <Button variant="outline" onClick={newWord}>
        Skip Word
      </Button>
    </div>
  )
}
