'use client'

import { TrendingUp, Activity } from 'lucide-react'

interface HeaderProps {
  usingLiveData: boolean
}

export default function Header({ usingLiveData }: HeaderProps) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-muted">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">
              INTELLiINVEST
            </h1>
            <p className="text-xs text-foreground-muted">
              AI-Powered Portfolio Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {usingLiveData ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="text-xs font-medium text-success">Live Market</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning-muted">
              <Activity className="w-3 h-3 text-warning" />
              <span className="text-xs font-medium text-warning">Cached Data</span>
            </div>
          )}
          <span className="hidden sm:inline text-xs text-foreground-muted font-mono">
            NSE / BSE
          </span>
        </div>
      </div>
    </header>
  )
}
