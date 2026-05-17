"use client"

import React from "react"
import ChatWindow from "../../components/chat/ChatWindow"

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-slate-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">INTELLiINVEST Assistant</h1>
        <p className="text-sm text-gray-300 mb-6">Ask portfolio-aware questions, request explanations, or request rebalancing suggestions.</p>
        <ChatWindow />
      </div>
    </div>
  )
}
