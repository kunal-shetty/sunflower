"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { generateChatResponse, ChatMessage } from "@/app/api/chat/route"
import { Send } from "lucide-react"

const CHAT_SESSION_KEY = "taskapp_chat_messages"

export default function ChatPage() {
  const storedUsername = localStorage.getItem("taskapp_username")
  const [ready, setReady] = useState(false)

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const clearChat = () => {
    sessionStorage.removeItem(CHAT_SESSION_KEY)

    setMessages([
      {
        role: "assistant",
        content: `Hey ${storedUsername}.\n\nAnything you feel like talking about?`,
      },
    ])
  }


  //  Load messages from session on mount
  useEffect(() => {
    const username = localStorage.getItem("taskapp_username")
    if (!username) {
      router.replace("/")
      return
    }

    const stored = sessionStorage.getItem(CHAT_SESSION_KEY)

    if (stored) {
      setMessages(JSON.parse(stored))
    } else {
      setMessages([
        {
          role: "assistant",
          content: `Hey ${username}.\n\nAnything you feel like talking about?`,
        },
      ])
    }

    setReady(true)
  }, [router])

  // Save messages to session whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem(CHAT_SESSION_KEY, JSON.stringify(messages))
    }
  }, [messages])

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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-8">
        <h1 className="text-3xl font-bold ms-4">
          Chat
        </h1>

        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          className="text-muted-foreground hover:text-foreground"
        >
          Clear
        </Button>
      </div>
      <hr />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <Card
              className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${m.role === "user"
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
              Thinking....
            </Card>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background px-3 py-3">
        <div className="flex gap-2 items-stretch">
          <Textarea
            placeholder="Tell me what you’re feeling…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="h-16 resize-none text-base leading-tight py-3"
          />

          <Button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="h-16 w-16 p-0 flex items-center justify-center active:scale-95 transition-transform"
          >
            {loading ? (
              <span className="animate-pulse text-xl">…</span>
            ) : (
              <Send className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
