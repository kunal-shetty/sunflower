"use client"

import { useEffect, useState } from "react"

interface HomeProps {
  username: string
}

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Success is not final, failure is not fatal.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
]

export function Home({ username }: HomeProps) {
  const [quote, setQuote] = useState(quotes[0])
  const [greeting, setGreeting] = useState("Hello")

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting("Good morning")
    } else if (hour < 18) {
      setGreeting("Good afternoon")
    } else {
      setGreeting("Good evening")
    }

    // Get random quote
    try {
      const lastQuoteDate = localStorage.getItem("taskapp_last_quote_date")
      const today = new Date().toDateString()

      if (lastQuoteDate !== today) {
        const randomIndex = Math.floor(Math.random() * quotes.length)
        setQuote(quotes[randomIndex])
        localStorage.setItem("taskapp_last_quote_date", today)
        localStorage.setItem("taskapp_current_quote", JSON.stringify(quotes[randomIndex]))
      } else {
        const storedQuote = localStorage.getItem("taskapp_current_quote")
        if (storedQuote) {
          setQuote(JSON.parse(storedQuote))
        }
      }
    } catch (error) {
      console.error("[v0] Error loading quote:", error)
    }
  }, [])

  return (
    <div className="min-h-[calc(100vh-5rem)] px-6 py-8">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Greeting */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
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

        {/* Quote of the Day */}
        <div className="rounded-xl border border-border bg-card p-8 space-y-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Quote of the Day</p>
          <blockquote className="space-y-4">
            <p className="text-xl font-medium leading-relaxed text-foreground text-pretty">"{quote.text}"</p>
            <footer className="text-base text-muted-foreground">— {quote.author}</footer>
          </blockquote>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-card p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Tasks Today</p>
            <p className="text-3xl font-bold text-foreground">
              {(() => {
                try {
                  const tasks = JSON.parse(localStorage.getItem("taskapp_tasks") || "[]")
                  return tasks.filter((t: any) => !t.completed).length
                } catch {
                  return 0
                }
              })()}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-3xl font-bold text-foreground">
              {(() => {
                try {
                  const tasks = JSON.parse(localStorage.getItem("taskapp_tasks") || "[]")
                  return tasks.filter((t: any) => t.completed).length
                } catch {
                  return 0
                }
              })()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
