"use client"

import React, {useEffect, useRef, useState} from "react"
import MessageBubble from "./MessageBubble"
import VoiceButton from "./VoiceButton"
import {BACKEND_URL, getStoredToken} from "@/lib/backend"

type Msg = {id: string; role: "user" | "bot"; text?: string; meta?: any}
const MODES = [
  {label: "Portfolio Assistant", value: "portfolio-assistant"},
  {label: "Financial Tutor", value: "financial-tutor"},
  {label: "Market Analyst", value: "market-analyst"},
  {label: "Risk Advisor", value: "risk-advisor"},
  {label: "Performance Tracker", value: "performance-tracker"},
] as const

export default function ChatWindow() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const messageId = useRef(0)
  const endRef = useRef<HTMLDivElement | null>(null)
  const [ttsEnabled, setTtsEnabled] = useState(true)
  const [mode, setMode] = useState<(typeof MODES)[number]["value"]>("portfolio-assistant")
  const [level, setLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate")
  const [disclaimer, setDisclaimer] = useState(
    "This chatbot provides AI-generated financial insights for educational purposes only and not professional investment advice."
  )

  useEffect(() => {
    endRef.current?.scrollIntoView({behavior: "smooth"})
  }, [messages])

  function pushMessage(m: Msg) {
    setMessages((s) => [...s, m])
  }

  async function send() {
    if (!input.trim()) return
    const userMsg: Msg = {id: `m-${messageId.current++}`, role: "user", text: input}
    pushMessage(userMsg)
    setInput("")
    setIsStreaming(true)
    const token = getStoredToken()

    const draftId = `m-${messageId.current++}`
    setMessages((s) => [...s, {id: draftId, role: "bot", text: "AI is analyzing..."}])

    // Start streaming POST to backend and read SSE chunks
    const resp = await fetch(`${BACKEND_URL}/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? {Authorization: `Bearer ${token}`} : {}),
      },
      body: JSON.stringify({message: input, mode, level}),
    })

    if (!resp.body) {
      setMessages((s) => s.map((m) => (m.id === draftId ? {...m, text: "No response body from server."} : m)))
      setIsStreaming(false)
      return
    }

    if (!resp.ok) {
      const message = await resp.text()
      setMessages((s) => s.map((m) => (m.id === draftId ? {...m, text: message || "Chat request failed"} : m)))
      setIsStreaming(false)
      return
    }

    const reader = resp.body.getReader()
    const decoder = new TextDecoder()
    let botText = ""
    let metaItems: any[] = []
    let sseBuffer = ""

    while (true) {
      const {done, value} = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, {stream: true})
      sseBuffer += chunk
      // server sends SSE 'data: {...}\n\n' frames
      const parts = sseBuffer.split("\n\n")
      sseBuffer = parts.pop() || ""
      for (const part of parts) {
        if (!part.trim()) continue
        const line = part.replace(/^data:\s*/g, "")
        try {
          const obj = JSON.parse(line)
          if (obj.type === "token") {
            botText += (obj.text || "") + " "
            setMessages((s) => s.map((m) => (m.id === draftId ? {...m, text: botText.trim()} : m)))
          } else if (obj.type === "explanation" || obj.type === "visual" || obj.type === "suggestions") {
            metaItems.push(obj)
          } else if (obj.type === "final") {
            botText = (obj.text || botText).trim()
            setDisclaimer(obj.disclaimer || disclaimer)
            setMessages((s) => s.map((m) => (m.id === draftId ? {...m, text: botText, meta: metaItems} : m)))
          }
        } catch (_e) {
          // ignore parse errors
        }
      }
    }

    // Ensure final meta is attached even if stream ended without final event
    setMessages((s) => s.map((m) => (m.id === draftId ? {...m, text: (botText || "Completed").trim(), meta: metaItems} : m)))
    const finalText = botText.trim()
    if (ttsEnabled && typeof window !== "undefined" && "speechSynthesis" in window && finalText) {
      const utterance = new SpeechSynthesisUtterance(finalText)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    }
    setIsStreaming(false)
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-3 border-b border-slate-700 flex flex-wrap gap-2 items-center">
        <div className="text-xs text-slate-300">Mode</div>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as (typeof MODES)[number]["value"])}
          className="bg-slate-900 text-xs rounded px-2 py-1 border border-slate-700"
        >
          {MODES.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <div className="text-xs text-slate-300 ml-2">Level</div>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as "beginner" | "intermediate" | "advanced")}
          className="bg-slate-900 text-xs rounded px-2 py-1 border border-slate-700"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <div className="p-4 h-[60vh] overflow-auto">
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} text={m.text} meta={m.meta} />
        ))}
        <div ref={endRef} />
      </div>
      <div className="p-4 bg-slate-900 flex gap-3 items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about your portfolio, risk, or request an explanation..."
          className="flex-1 bg-slate-800 rounded px-3 py-2 outline-none"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTtsEnabled((s) => !s)}
            className={`px-3 py-2 rounded border ${ttsEnabled ? "border-emerald-300 bg-emerald-900/40" : "border-slate-600 bg-slate-800"}`}
            title="Toggle text to speech"
          >
            {ttsEnabled ? "Voice On" : "Voice Off"}
          </button>
          <VoiceButton onResult={(text) => { setInput((s) => (s ? s + ' ' + text : text)) }} />
          <button onClick={send} disabled={isStreaming} className="bg-indigo-500 px-4 py-2 rounded">
            {isStreaming ? "Analyzing…" : "Send"}
          </button>
        </div>
      </div>
      <div className="px-4 pb-3 text-[10px] text-slate-400">{disclaimer}</div>
    </div>
  )
}
