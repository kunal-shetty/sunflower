"use server"

import { GoogleGenAI } from "@google/genai"

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
const ai = new GoogleGenAI({ apiKey })

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export async function generateChatResponse(userPrompt: string, contextMessages: ChatMessage[] = []) {
  try {
    if (!apiKey) {
      return {
        success: false,
        content: "",
        error: "API Key missing. Please set GEMINI_API_KEY in server environment variables.",
      }
    }

    // Build context
    let historyContext = ""
    if (contextMessages.length > 0) {
      historyContext =
        "Previous conversation:\n" +
        contextMessages.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n") +
        "\n\n"
    }

    const systemInstruction = `
You are a friendly, calm companion who talks like a real person.

Your vibe:
- Warm, relaxed, and easy to talk to
- Sound like a supportive friend, not an expert
- Be present and understanding, not preachy

Very important rule:
- If the user asks a direct question, answer it clearly first
- Do NOT avoid the question
- If it’s a yes/no question, start with yes, no, or probably
- After answering, you may add gentle emotional context

How to respond:
- Keep replies short and simple
- Be honest but kind
- Offer reassurance without being vague
- Avoid fixing things unless asked
- It’s okay to say you don’t know, but explain why simply

Boundaries:
- You are not a therapist or doctor
- Don’t diagnose or give medical advice
- Don’t create emotional dependency
- If the user sounds seriously distressed, gently suggest reaching out to someone they trust or a professional

Style rules:
- Plain text only
- No emojis, no markdown, no symbols
- No clinical or formal language
- 2–4 short lines max unless the user writes a lot
- Sound human, calm, and caring
`

    const prompt = `${systemInstruction}

Conversation so far:
${historyContext}

User says:
${userPrompt}

Answer the user’s question directly if one is asked, then respond with warmth.
`


    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    })

    return {
      success: true,
      content: response.text || "I'm having trouble generating a response. Please try again.",
    }
  } catch (error) {
    console.error("Chat error:", error)
    return {
      success: false,
      content: "",
      error: "Failed to generate response. Please try again.",
    }
  }
}
