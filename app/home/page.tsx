"use client"

import { useEffect, useState } from "react"
import { Home } from "@/components/home"
import { useRouter } from "next/navigation"
import { OfflineScreen } from "@/components/OfflineScreen"

export default function HomePage() {
  const [username, setUsername] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isOnline, setIsOnline] = useState<boolean | null>(null)

  const router = useRouter()

  // Username check
  useEffect(() => {
    if (typeof window === "undefined") return

    const storedUsername = localStorage.getItem("taskapp_username")
    if (!storedUsername) {
      router.push("/")
      return
    }

    setUsername(storedUsername)
    setIsLoading(false)
  }, [router])

  // Offline detection
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine)
    } else {
      setIsOnline(true)
    }

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Loading / hydration
  if (isOnline === null || isLoading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // 🌻 OFFLINE → NO NAVBAR (because Home is not rendered)
  if (!isOnline) {
    return <OfflineScreen />
  }

  if (!username) return null

  return <Home username={username} />
}
