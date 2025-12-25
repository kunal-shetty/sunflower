"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { generateChatResponse, ChatMessage } from "@/app/api/chat/route"


export default function ChatPage() {
  const storedUsername = localStorage.getItem("taskapp_username")
  const [ready, setReady] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: 
        `Hey ${storedUsername}.\n\nAnything you feel like talking about?`
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const bottomRef = useRef<HTMLDivElement | null>(null)

  // 🔐 Auth guard
  useEffect(() => {
    const username = localStorage.getItem("taskapp_username")
    if (!username) {
      router.replace("/")
      return
    }
    setReady(true)
  }, [router])

  // ⬇ Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
    }

    const updated = [...messages, userMessage]
    setMessages(updated)
    setInput("")
    setLoading(true)

    const res = await generateChatResponse(userMessage.content, updated)

    setLoading(false)

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: res.success
          ? res.content
          : "I’m here, but something went wrong. We can try again gently.",
      },
    ])
  }

  if (!ready) {
    return (
      <div className="flex h-[100dvh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full pt-4">
        
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <Card
              className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {m.content}
            </Card>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <Card className="px-4 py-3 text-sm bg-muted opacity-70">
              I’m listening…
            </Card>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background px-3 py-3">
        <div className="flex items-end gap-2">
          <Textarea
            placeholder="Tell me what you’re feeling…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={2}
            className="resize-none text-base"
          />

          <Button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="h-11 px-4"
          >
            {loading ? "…" : "Send"}
          </Button>
        </div>

      </div>
    </div>
  )
}
