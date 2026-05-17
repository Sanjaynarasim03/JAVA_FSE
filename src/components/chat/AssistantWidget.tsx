"use client"

import React, {useState} from "react"
import ChatWindow from "./ChatWindow"

export default function AssistantWidget() {
  const [open, setOpen] = useState(false)

  return (
    <div>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => setOpen((s) => !s)} className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-teal-400 shadow-lg text-white flex items-center justify-center">
          {open ? '×' : 'i'}
        </button>
      </div>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-128 max-h-[70vh]">
          <div className="bg-slate-900 rounded shadow-lg h-full overflow-hidden">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">INTELLiINVEST Assistant</div>
                <div className="text-xs text-slate-400">Portfolio-aware copilot</div>
              </div>
              <div>
                <button onClick={() => setOpen(false)} className="text-slate-300">Close</button>
              </div>
            </div>
            <div className="p-3 h-full">
              <ChatWindow />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
