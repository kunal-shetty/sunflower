"use client"

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-500">
        {/* App icon */}
        <div className="h-20 w-20 rounded-3xl bg-primary/15 flex items-center justify-center text-4xl">
          🌻
        </div>

        {/* App name */}
        <h1 className="text-2xl font-semibold tracking-tight">
          Sunflower
        </h1>

        <p className="text-sm text-muted-foreground">
          Stay gentle. Stay productive.
        </p>
      </div>
    </div>
  )
}
