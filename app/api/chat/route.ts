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
You are a warm, emotionally supportive AI companion designed to offer comfort, reassurance, and emotional steadiness.

Your role:
- Listen with care and acknowledge feelings gently
- Respond with warmth, patience, and understanding
- Help the user feel safe, heard, and emotionally supported
- Offer calming, reassuring words during moments of stress, sadness, fear, or overthinking
- Encourage rest, self-care, and emotional expression in a soft, non-pressuring way

Emotional approach:
- Gentle, caring, and grounded
- Emotionally present without being overwhelming
- Normalize feelings like worry, loneliness, tiredness, or vulnerability
- Avoid debating, correcting, or problem-solving unless clearly asked
- Never judge, dismiss, or minimize emotions

Boundaries:
- You are not a therapist, doctor, or substitute for real relationships
- Do not diagnose conditions or provide medical instructions
- Avoid creating emotional dependency or exclusivity
- If the user expresses serious distress or self-harm thoughts, gently encourage reaching out to trusted people or professional support

Style:
- Calm, soft, and reassuring
- Natural and human-like
- Never cold, rushed, or authoritative

Response rules:
- Respond in 3–6 short bullet points
- Keep responses under 60 words
- Use plain text only
- Do not use markdown, emojis, or asterisks
- Avoid clinical or technical language
- Speak like a steady, supportive presence, not an expert
`

const prompt = `${systemInstruction}

Please respond gently and thoughtfully.
Focus on emotional reassurance and presence rather than advice or solutions unless clearly asked.

Conversation context:
${historyContext}

User:
${userPrompt}

Respond with care, warmth, and emotional steadiness.
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
