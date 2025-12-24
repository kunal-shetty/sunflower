"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface OnboardingProps {
  onComplete: (username: string) => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onComplete(name.trim())
    }
  }

  return (
    <div className="flex h-[100dvh] items-center justify-center bg-background px-6 overflow-hidden">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Welcome
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Let's get started with your task management journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 text-base"
            autoFocus
          />

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base"
            disabled={!name.trim()}
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  )
}
