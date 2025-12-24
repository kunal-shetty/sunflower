"use client"

import { useEffect, useState } from "react"
import { Home } from "@/components/home"
import { Tasks } from "@/components/tasks"
import { Settings } from "@/components/settings"
import { Onboarding } from "@/components/onboarding"
import { BottomNav } from "@/components/bottom-nav"

type Tab = "home" | "tasks" | "settings"

export default function Page() {
  const [currentTab, setCurrentTab] = useState<Tab>("home")
  const [username, setUsername] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
const [theme, setTheme] = useState<"light" | "dark">("light")

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
  useEffect(() => {
    try {
      const storedUsername = localStorage.getItem("taskapp_username")
      setUsername(storedUsername)
    } catch (error) {
      console.error("[v0] Error loading username:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleOnboardingComplete = (name: string) => {
    try {
      localStorage.setItem("taskapp_username", name)
      setUsername(name)
    } catch (error) {
      console.error("[v0] Error saving username:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!username) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <main className="flex-1">
        {currentTab === "home" && <Home username={username} />}
        {currentTab === "tasks" && <Tasks />}
        {currentTab === "settings" && <Settings />}
      </main>
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  )
}
