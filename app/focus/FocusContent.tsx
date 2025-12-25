"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, Pause, Play, TimerOff } from "lucide-react"

export default function FocusContent() {
  const [hours, setHours] = useState("")
  const [minutes, setMinutes] = useState("")
  const [seconds, setSeconds] = useState("")
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const taskId = params.get("taskId")


  const [theme, setTheme] = useState<"light" | "dark">("light")

  const markTaskAsCompleted = () => {
    if (!taskId) return

    try {
      const stored = JSON.parse(
        localStorage.getItem("taskapp_tasks") || "[]"
      )

      const updated = stored.map((task: any) =>
        task.id === taskId
          ? { ...task, completed: true }
          : task
      )

      localStorage.setItem(
        "taskapp_tasks",
        JSON.stringify(updated)
      )
    } catch (err) {
      console.error("Failed to mark task complete", err)
    }
  }

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("taskapp_theme") as "light" | "dark" | null
      if (storedTheme) {
        setTheme(storedTheme)
        document.documentElement.classList.toggle("dark", storedTheme === "dark")
      }
    } catch (error) {
      console.error("[v0] Error loading theme:", error)
    }
  }, [])

  // ⏱ Timer logic
  useEffect(() => {
    if (!isRunning || secondsLeft === null) return

    if (secondsLeft <= 0) {
      setCompleted(true)
      setIsRunning(false)
      return
    }

    const interval = setInterval(() => {
      setSecondsLeft((s) => (s !== null ? s - 1 : s))
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, secondsLeft])

  const startFocus = () => {
    const h = parseInt(hours) || 0
    const m = parseInt(minutes) || 0
    const s = parseInt(seconds) || 0

    const totalSeconds = h * 3600 + m * 60 + s
    if (totalSeconds <= 0) return

    setSecondsLeft(totalSeconds)
    setIsRunning(true)
  }

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
  }

  const goBack = () => {
    setHours("")
    setMinutes("")
    setSeconds("")
    router.push("/tasks")
  }


  // COMPLETION
  if (completed) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <Card className="relative w-full max-w-md p-8 text-center space-y-6 shadow-xl border-2">
          <div className="text-7xl animate-bounce">🌻</div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold bg-clip-text bg-gradient-to-r from-yellow-600 via-red-400 to-orange-600 text-transparent">
              Focus Session Complete!
            </h2>
            <p className="text-muted-foreground">
              You've successfully completed your focus session!
            </p>
          </div>
          <Button className="w-full h-11 text-base" onClick={goBack}>
            Back to Tasks
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md p-6 sm:p-8 space-y-6 shadow-xl border-2">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Focus Mode
          </h1>
          <p className="text-sm text-muted-foreground">Stay focused and productive</p>
        </div>

        {secondsLeft === null ? (
          <>
            {/* Time input */}
            <div className="space-y-4">
              <label className="block text-center text-sm font-medium text-muted-foreground">
                Set your focus duration
              </label>

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    placeholder="00"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="text-center text-lg font-mono h-14"
                  />
                  <label className="block text-xs text-center text-muted-foreground font-medium">
                    Hours
                  </label>
                </div>

                <div className="space-y-2">
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="00"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="text-center text-lg font-mono h-14"
                  />
                  <label className="block text-xs text-center text-muted-foreground font-medium">
                    Minutes
                  </label>
                </div>

                <div className="space-y-2">
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="00"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    className="text-center text-lg font-mono h-14"
                  />
                  <label className="block text-xs text-center text-muted-foreground font-medium">
                    Seconds
                  </label>
                </div>
              </div>
            </div>

            <Button className="w-full h-12 text-base font-medium" onClick={startFocus}>
              Begin Focus Session
            </Button>
          </>
        ) : (
          <>
            {/* Timer */}
            <div className="flex justify-center py-4">
              <div className="relative h-48 w-48 sm:h-56 sm:w-56">
                <div className="absolute inset-0 rounded-full border-8 border-primary/20"></div>
                <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-primary animate-spin" style={{ animationDuration: isRunning ? "3s" : "0s" }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-mono font-bold tracking-wider">
                    {formatTime(secondsLeft)}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-11 text-base font-medium flex items-center justify-center gap-2"
                onClick={() => setIsRunning((v) => !v)}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Resume
                  </>
                )}
              </Button>


              <Button
                className="w-full h-11 text-base font-medium"
                onClick={() => {
                  setCompleted(true)
                  markTaskAsCompleted()
                }
                }
              >
                <Check /> Complete Focus Session
              </Button>

              <Button
                variant="ghost"
                className="w-full h-11 text-base font-medium text-destructive hover:text-destructive"
                onClick={() => setShowEndConfirm(true)}
              >
                <TimerOff/> End Session Early
              </Button>
            </div>
          </>
        )}
      </Card>

      {/* End focus confirmation */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <Card className="w-full max-w-sm p-6 space-y-5 text-center shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">
                End Focus Session?
              </h3>
              <p className="text-sm text-muted-foreground">
                Ending now means your progress won't be saved and the task won't be marked as complete.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11"
                onClick={() => setShowEndConfirm(false)}
              >
                Keep Focusing
              </Button>

              <Button
                variant="destructive"
                className="flex-1 h-11"
                onClick={goBack}
              >
                End Session
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}