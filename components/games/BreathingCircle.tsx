"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function BreathingCircle() {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [count, setCount] = useState(4)
  const [isActive, setIsActive] = useState(false)
  const [cycles, setCycles] = useState(0)

  useEffect(() => {
    if (!isActive) return

    const timer = setInterval(() => {
      setCount((c) => {
        if (c > 1) return c - 1

        if (phase === "inhale") {
          setPhase("hold")
          return 4
        } else if (phase === "hold") {
          setPhase("exhale")
          return 4
        } else {
          setPhase("inhale")
          setCycles((prev) => prev + 1)
          return 4
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, phase])

  const phaseText = {
    inhale: "Breathe In",
    hold: "Hold",
    exhale: "Breathe Out",
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-6 min-h-[70vh]">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{phaseText[phase]}</h2>
        <p className="text-sm text-muted-foreground">Cycles: {cycles}</p>
      </div>

      <div className="relative">
        <div
          className={`w-48 h-48 rounded-full border-4 border-primary/30 flex items-center justify-center transition-all duration-1000 ${
            phase === "inhale"
              ? "scale-125 bg-primary/10"
              : phase === "exhale"
                ? "scale-75 bg-primary/5"
                : "scale-100 bg-primary/8"
          }`}
        >
          <span className="text-6xl font-bold text-primary">{count}</span>
        </div>
      </div>

      <Button
        onClick={() => {
          setIsActive(!isActive)
          if (!isActive) {
            setPhase("inhale")
            setCount(4)
          }
        }}
        className="w-48"
      >
        {isActive ? "Pause" : "Start"}
      </Button>
    </div>
  )
}
