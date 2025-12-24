"use client"

import { useEffect, useState } from "react"
import confetti from "canvas-confetti"

interface HomeProps {
  username: string
}

interface Task {
  id: string
  title: string
  deadline: string
  completed: boolean
}

interface SpecialDay {
  month: number // 0-based (Jan = 0)
  day: number
  title: string
  message: string
  emoji: string
}

const SPECIAL_DAYS: SpecialDay[] = [
  { month: 0, day: 1, title: "Happy New Year", message: "New year, new goals, old us!", emoji: "🎉" },
  { month: 0, day: 22, title: "Ayushi’s Birthday", message: "Happy birthday Ayushiiii, I love you so much 🎂", emoji: "🎂" },

  { month: 1, day: 14, title: "Valentine’s Day", message: "I love you so much Ayushi 💖", emoji: "💘" },

  { month: 2, day: 8, title: "International Women’s Day", message: "Happy Women’s day to my strongest woman 🌸", emoji: "🌸" },

  { month: 3, day: 22, title: "Earth Day", message: "You are my Earth, my world, my everything 🌍", emoji: "🌍" },

  { month: 4, day: 1, title: "May Day", message: "A fresh month — set one intention for the next 30 days ✨", emoji: "✨" },

{ month: 7, day: 7, title: "I Love You", message: "", emoji: "💗"},
  { month: 7, day: 15, title: "Independence Day (India)", message: "Celebrate freedom, unity, and progress", emoji: "" },

  { month: 7, day: 30, title: "Friendship Day", message: "Thank you for being my bestest friend 🤝", emoji: "💛" },

  { month: 8, day: 5, title: "Teachers’ Day", message: "Thank you for teaching me how to love 📚", emoji: "📚" },

  { month: 10, day: 12, title: "Diwali", message: "Happy Diwali my Batata 🪔", emoji: "🪔" },
  { month: 10, day: 14, title: "Children’s Day", message: "Keep curiosity and wonder alive 🌈", emoji: "🌈" },

  { month: 11, day: 25, title: "Merry Christmas", message: "Wishing you warmth, joy, and peace just like you 🎄", emoji: "🎁" },
]

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Well begun is half done.", author: "Aristotle" },
  { text: "It always seems impossible until it’s done.", author: "Nelson Mandela" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "Don’t count the days, make the days count.", author: "Muhammad Ali" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
  { text: "Start by doing what’s necessary; then do what’s possible; and suddenly you are doing the impossible.", author: "Francis of Assisi" },
  { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
]


const fireConfetti = () => {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#FDB813", "#FFD966", "#FFA500", "#FF8C00"],
  })
}

const FloatingEmojis = ({ emoji }: { emoji: string }) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <span
          key={i}
          className="absolute text-2xl opacity-60 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `-${Math.random() * 20}px`,
            animationDelay: `${Math.random() * 0.2}s`,
            animationDuration: `${4 + Math.random() * 6}s`,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  )
}


export function Home({ username }: HomeProps) {
  const [quote, setQuote] = useState(quotes[0])
  const [greeting, setGreeting] = useState("Hello")
  const [nextTask, setNextTask] = useState<Task | null>(null)
  const [timeLeft, setTimeLeft] = useState("")
  const [specialDay, setSpecialDay] = useState<SpecialDay | null>(null)

  useEffect(() => {
    if (specialDay) {
      fireConfetti()
    }
  }, [specialDay])

  useEffect(() => {

    const today = new Date()

    const month = today.getMonth()
    const day = today.getDate()

    const match = SPECIAL_DAYS.find(
      (d) => d.month === month && d.day === day
    )

    setSpecialDay(match || null)
  }, [])


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
        {specialDay && (<FloatingEmojis emoji={specialDay.emoji} />)}

        {specialDay && (
          <div className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-sm">
            {/* soft background glow */}
            <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />

            <div className="relative flex items-start gap-4">
              {/* emoji badge */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
                {specialDay.emoji}
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-semibold leading-tight">
                  {specialDay.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {specialDay.message}
                </p>
              </div>
            </div>

            {/* subtle bottom accent */}
            <div className="pointer-events-none absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary/40 via-primary/10 to-transparent" />
          </div>
        )}


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
