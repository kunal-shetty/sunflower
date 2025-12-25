"use client"

import { usePathname } from "next/navigation"
import { BottomNav } from "@/components/bottom-nav"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const showBottomNav =
    pathname === "/home" ||
    pathname === "/tasks" ||
    pathname === "/settings" ||
    pathname === "/chat"

  return (
    <div className="flex h-[100dvh] flex-col bg-background overflow-hidden">
      <main className="flex-1 overflow-y-auto overscroll-none">
        {children}
      </main>

      {showBottomNav && <BottomNav />}
    </div>
  )
}
