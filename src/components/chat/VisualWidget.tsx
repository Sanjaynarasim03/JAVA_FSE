"use client"

import React from "react"
import {LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip} from "recharts"

const COLORS = ["#4F46E5", "#06B6D4", "#10B981", "#F59E0B", "#EF4444"]

export default function VisualWidget({
  allocations,
  growth,
  riskGauge,
}: {
  allocations: Array<{ticker: string; pct: number}>
  growth?: Array<{month: string; predicted: number; actual: number}>
  riskGauge?: number
}) {
  return (
    <div className="w-full bg-slate-800 rounded p-3 space-y-3">
      <div className="h-56">
        <h3 className="text-sm mb-2">Allocation</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={allocations} dataKey="pct" nameKey="ticker" innerRadius={40} outerRadius={80} paddingAngle={2}>
              {allocations.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {growth && growth.length > 0 && (
        <div className="h-48">
          <h3 className="text-sm mb-2">Predicted vs Actual</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growth}>
              <XAxis dataKey="month" tick={{fontSize: 10}} />
              <YAxis tick={{fontSize: 10}} />
              <Tooltip />
              <Line type="monotone" dataKey="predicted" stroke="#22d3ee" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="actual" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {typeof riskGauge === "number" && (
        <div>
          <div className="text-xs mb-1">Risk Gauge</div>
          <div className="h-2 bg-slate-600 rounded overflow-hidden">
            <div className="h-full bg-rose-400" style={{width: `${Math.max(0, Math.min(100, riskGauge))}%`}} />
          </div>
          <div className="text-[10px] text-slate-300 mt-1">{riskGauge}/100</div>
        </div>
      )}
    </div>
  )
}
