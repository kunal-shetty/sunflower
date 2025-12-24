"use client"

import { useEffect, useState } from "react"
import { Home } from "@/components/home"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HomePage() {
  const [username, setUsername] = useState<string | null>(null)
  const [nameInput, setNameInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUsername = localStorage.getItem("taskapp_username")
    setUsername(storedUsername)
    setIsLoading(false)
  }, [])

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameInput.trim()) return

    localStorage.setItem("taskapp_username", nameInput.trim())
    setUsername(nameInput.trim())
  }

  if (isLoading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // ✅ ONBOARDING UI (inline)
  if (!username) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-background px-6 overflow-hidden">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
                />
              </svg>
            </div>

            <h1 className="text-4xl font-bold">Welcome</h1>
            <p className="text-muted-foreground text-lg">
              Let’s get started with your task management journey
            </p>
          </div>

          <form onSubmit={handleOnboardingSubmit} className="space-y-6">
            <Input
              placeholder="Enter your name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="h-12 text-base"
              autoFocus
            />

            <Button
              type="submit"
              size="lg"
              className="w-full h-12"
              disabled={!nameInput.trim()}
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    )
  }

  // HOME DASHBOARD
  return <Home username={username} />
}
