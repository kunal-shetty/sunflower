"use client"

import { Button } from "@/components/ui/button"

export function OfflineScreen() {
  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center px-6 text-center bg-background">
      <div className="space-y-4 max-w-sm">
        <div className="text-5xl">🌻</div>

        <h1 className="text-xl font-semibold">
          You’re offline
        </h1>

        <p className="text-sm text-muted-foreground leading-relaxed">
          It looks like you don’t have an internet connection right now.
          Your tasks are safe and will be here when you’re back online.
        </p>

        <Button
          className="w-full"
          onClick={() => window.location.reload()}
        >
          Try again
        </Button>

        <p className="text-xs text-muted-foreground">
          Connect to the internet to continue
        </p>
      </div>
    </div>
  )
}
