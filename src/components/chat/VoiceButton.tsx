"use client"

import React, {useMemo, useRef, useState} from "react"

type VoiceButtonProps = {
  onResult: (text: string) => void
}

type SpeechRecognitionLike = {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: ((event: any) => void) | null
  onerror: ((event: any) => void) | null
  onend: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
}

export default function VoiceButton({onResult}: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string>("")
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)

  const RecognitionCtor = useMemo(() => {
    if (typeof window === "undefined") return null
    return window.SpeechRecognition || window.webkitSpeechRecognition || null
  }, [])

  function startListening() {
    setError("")
    if (!RecognitionCtor) {
      setError("Voice input unsupported in this browser")
      return
    }

    const recognition = new RecognitionCtor()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event: any) => {
      let transcript = ""
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript
      }
      if (transcript.trim()) {
        onResult(transcript.trim())
      }
    }

    recognition.onerror = (event: any) => {
      setError(event?.error ? `Voice error: ${event.error}` : "Voice recognition failed")
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    setIsListening(true)
    recognition.start()
  }

  function stopListening() {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={isListening ? stopListening : startListening}
        className={`px-3 py-2 rounded border ${isListening ? "border-cyan-300 bg-cyan-900/40" : "border-slate-600 bg-slate-800"}`}
        title="Voice input"
      >
        {isListening ? "Listening..." : "Mic"}
      </button>
      {error && <p className="text-[10px] text-rose-300 max-w-[10rem] text-right">{error}</p>}
    </div>
  )
}
