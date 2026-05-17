"use client"

import React from "react"
import VisualWidget from "./VisualWidget"

export default function MessageBubble({role, text, meta}: {role: "user" | "bot"; text?: string; meta?: any}) {
  const isUser = role === "user"
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`${isUser ? "bg-indigo-600 text-white" : "bg-slate-700 text-white"} max-w-xl p-3 rounded-md shadow`}>
        {text && <div className="whitespace-pre-wrap">{text}</div>}
        {meta && Array.isArray(meta) && (
          <div className="mt-2 space-y-2">
            {meta.map((m: any, i: number) => (
              <div key={i} className="bg-slate-800 p-2 rounded">
                <strong className="text-sm">{m.title || m.type}</strong>
                {m.factors && (
                  <ul className="text-xs mt-1 space-y-1">
                    {Object.entries(m.factors).map(([k, v]) => (
                      <li key={k}>
                        <div className="flex items-center justify-between gap-2">
                          <span>{k}</span>
                          <span>{Number(v)}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-600 rounded mt-0.5 overflow-hidden">
                          <div className="h-full bg-cyan-400" style={{width: `${Math.max(0, Math.min(100, Number(v) || 0))}%`}} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {m.summary && <p className="text-xs text-slate-300 mt-2">{m.summary}</p>}
                {m.confidence && <p className="text-xs mt-1">Confidence: {m.confidence}%</p>}
                {m.type === "visual" && Array.isArray(m.allocations) && <VisualWidget allocations={m.allocations} growth={m.growth} riskGauge={m.riskGauge} />}
                {m.type === "suggestions" && Array.isArray(m.items) && (
                  <ul className="text-xs mt-1 list-disc list-inside space-y-1">
                    {m.items.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
