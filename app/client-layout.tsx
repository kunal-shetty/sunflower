"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"
import { OfflineScreen } from "@/components/OfflineScreen"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Initial state
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // 🌻 OFFLINE UI (no bottom nav, no routing confusion)
  if (!isOnline) {
    return <OfflineScreen />
  }

  const showBottomNav =
    pathname === "/home" ||
    pathname === "/tasks" ||
    pathname === "/settings"
    
  return (
    <div className="flex h-[100dvh] flex-col bg-background overflow-hidden">
      <main className="flex-1 overflow-y-auto overscroll-none">
        {children}
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  )
}
