"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Settings } from "@/components/settings"
import { BottomNav } from "@/components/bottom-nav"

export default function SettingsPage() {
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

  const handleNameChange = (newName: string | null) => {
    if (newName) {
      localStorage.setItem("taskapp_username", newName)
      setUsername(newName)
    }
  }

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
        <Settings username={username} onNameChange={handleNameChange} />
      </div>
    </div>
  )
}
