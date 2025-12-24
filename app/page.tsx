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
    const storedTheme = localStorage.getItem("taskapp_theme") as
      | "light"
      | "dark"
      | null

    if (storedTheme) {
      setTheme(storedTheme)
      document.documentElement.classList.toggle("dark", storedTheme === "dark")
    }
  }, [])

  useEffect(() => {
    const storedUsername = localStorage.getItem("taskapp_username")
    setUsername(storedUsername)
    setIsLoading(false)
  }, [])

  const handleOnboardingComplete = (name: string) => {
    localStorage.setItem("taskapp_username", name)
    setUsername(name)
  }

  if (isLoading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!username) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-background overflow-hidden">
      <main className="flex-1 overflow-y-auto overscroll-none">
        {currentTab === "home" && <Home username={username} />}
        {currentTab === "tasks" && <Tasks />}
        {currentTab === "settings" && <Settings />}
      </main>

      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  )
}
