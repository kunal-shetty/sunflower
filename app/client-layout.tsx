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

  // Start as null (unknown), NOT true/false
  const [isOnline, setIsOnline] = useState<boolean | null>(null)

  useEffect(() => {
    // Now we are 100% in browser
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

  // 🌻 Offline UI
  if (!isOnline) {
    return <OfflineScreen />
  }

  const showBottomNav =
    pathname === "/home" ||
    pathname === "/tasks" ||
    pathname === "/settings" ||
    pathname === "/focus"

  return (
    <div className="flex h-[100dvh] flex-col bg-background overflow-hidden">
      <main className="flex-1 overflow-y-auto overscroll-none">
        {children}
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  )
}
