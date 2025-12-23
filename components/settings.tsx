"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function Settings() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    try {
      localStorage.setItem("taskapp_theme", newTheme)
      document.documentElement.classList.toggle("dark", newTheme === "dark")
    } catch (error) {
      console.error("[v0] Error saving theme:", error)
    }
  }

  const exportTasks = () => {
    try {
      const tasks = localStorage.getItem("taskapp_tasks") || "[]"
      const dataStr = JSON.stringify(JSON.parse(tasks), null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `tasks-${new Date().toISOString().split("T")[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] Error exporting tasks:", error)
    }
  }

  const deleteAllTasks = () => {
    try {
      localStorage.setItem("taskapp_tasks", "[]")
      setShowDeleteConfirm(false)
      window.location.reload()
    } catch (error) {
      console.error("[v0] Error deleting tasks:", error)
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] px-6 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>

        {/* Theme Toggle */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-medium text-foreground">Appearance</h3>
              <p className="text-sm text-muted-foreground">{theme === "light" ? "Light mode" : "Dark mode"}</p>
            </div>
            <button
              onClick={toggleTheme}
              className="relative h-11 w-20 rounded-full bg-secondary transition-colors hover:bg-secondary/80"
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              <div
                className={`absolute top-1 h-9 w-9 rounded-full bg-primary transition-transform duration-200 flex items-center justify-center ${
                  theme === "dark" ? "translate-x-9" : "translate-x-1"
                }`}
              >
                {theme === "light" ? (
                  <svg
                    className="h-5 w-5 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </Card>

        {/* Export Tasks */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-medium text-foreground">Export Tasks</h3>
              <p className="text-sm text-muted-foreground">Download all tasks as JSON</p>
            </div>
            <Button onClick={exportTasks} variant="outline" className="h-10 bg-transparent">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export
            </Button>
          </div>
        </Card>

        {/* Delete All Tasks */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-medium text-foreground">Delete All Tasks</h3>
                <p className="text-sm text-muted-foreground">Permanently remove all tasks</p>
              </div>
              <Button onClick={() => setShowDeleteConfirm(true)} variant="destructive" className="h-10">
                Delete All
              </Button>
            </div>

            {showDeleteConfirm && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="text-sm font-medium text-foreground">Are you sure you want to delete all tasks?</p>
                <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <Button onClick={deleteAllTasks} variant="destructive" className="flex-1 h-10">
                    Yes, Delete All
                  </Button>
                  <Button onClick={() => setShowDeleteConfirm(false)} variant="outline" className="h-10">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* App Info */}
        <Card className="p-6">
          <div className="space-y-3 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-medium text-foreground">Task App</h3>
              <p className="text-sm text-muted-foreground mt-1">Version 1.0.0</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
