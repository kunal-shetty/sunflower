"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tasks } from "@/components/tasks"
import { BottomNav } from "@/components/bottom-nav"

export default function TasksPage() {
  const [username, setUsername] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUsername = localStorage.getItem("taskapp_username")
    if (!storedUsername) {
      router.push("/")
    } else {
      setUsername(storedUsername)
    }
    setIsLoading(false)
  }, [router])

  if (isLoading || !username) {
    return (
      <div className="flex h-[100dvh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="h-[100dvh] overflow-hidden bg-background">
      <div className="h-[calc(100dvh-5rem)] overflow-y-auto">
        <Tasks />
      </div>
      <BottomNav currentView="tasks" />
    </div>
  )
}
