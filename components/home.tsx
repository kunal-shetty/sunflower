"use client"

import { useEffect, useState } from "react"

interface HomeProps {
  username: string
}

interface Task {
  id: string
  title: string
  deadline: string
  completed: boolean
}

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
]

export function Home({ username }: HomeProps) {
  const [quote, setQuote] = useState(quotes[0])
  const [greeting, setGreeting] = useState("Hello")
  const [nextTask, setNextTask] = useState<Task | null>(null)
  const [timeLeft, setTimeLeft] = useState("")

  // Greeting + Quote
  useEffect(() => {
    const hour = new Date().getHours()
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening")

    try {
      const today = new Date().toDateString()
      const lastDate = localStorage.getItem("taskapp_last_quote_date")

      if (lastDate !== today) {
        const random = quotes[Math.floor(Math.random() * quotes.length)]
        setQuote(random)
        localStorage.setItem("taskapp_last_quote_date", today)
        localStorage.setItem("taskapp_current_quote", JSON.stringify(random))
      } else {
        const stored = localStorage.getItem("taskapp_current_quote")
        if (stored) setQuote(JSON.parse(stored))
      }
    } catch { }
  }, [])

  // Deadline logic
  useEffect(() => {
    const updateDeadlineInfo = () => {
      try {
        const tasks: Task[] = JSON.parse(localStorage.getItem("taskapp_tasks") || "[]")

        const upcoming = tasks
          .filter(t => !t.completed && t.deadline)
          .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())

        if (!upcoming.length) {
          setNextTask(null)
          setTimeLeft("")
          return
        }

        const task = upcoming[0]
        const now = new Date().getTime()
        const deadline = new Date(task.deadline).getTime()
        const diff = deadline - now

        if (diff <= 0) {
          setNextTask(task)
          setTimeLeft("Overdue")
          return
        }

        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        if (days > 0) {
          setTimeLeft(`${days} day${days > 1 ? "s" : ""} left`)
        } else if (hours > 0) {
          setTimeLeft(`${hours} hour${hours > 1 ? "s" : ""} left`)
        } else {
          setTimeLeft(`${minutes} min left`)
        }

        setNextTask(task)
      } catch {
        setNextTask(null)
        setTimeLeft("")
      }
    }

    updateDeadlineInfo()
    const interval = setInterval(updateDeadlineInfo, 60000)
    return () => clearInterval(interval)
  }, [])

  const getTasks = () => {
    try {
      return JSON.parse(localStorage.getItem("taskapp_tasks") || "[]")
    } catch {
      return []
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] px-6 py-8">
      <div className="mx-auto max-w-2xl space-y-8">

        {/* Greeting */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">
            {greeting}, {username}
          </h1>
          <p className="text-lg text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Quote */}
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Quote of the Day</p>
          <p className="text-xl font-medium">"{quote.text}"</p>
          <p className="text-muted-foreground">— {quote.author}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">Active Tasks</p>
            <p className="text-3xl font-bold">
              {getTasks().filter((t: any) => !t.completed).length}
            </p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-3xl font-bold">
              {getTasks().filter((t: any) => t.completed).length}
            </p>
          </div>
        </div>
        {/* Deadline Card */}
        <div className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm">

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Next Deadline
            </p>

            {nextTask ? (
              <>
                <h3 className="text-lg font-semibold text-foreground leading-snug">
                  {nextTask.title}
                </h3>

                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${timeLeft === "Overdue"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {/* dot */}
                  <span
                    className={`h-2 w-2 rounded-full ${timeLeft === "Overdue" ? "bg-destructive" : "bg-primary"
                      }`}
                  />
                  {timeLeft}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                No upcoming deadlines
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
