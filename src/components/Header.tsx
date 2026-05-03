'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Activity, LogOut, TrendingUp } from 'lucide-react'
import { clearAuthSession, readAuthSession } from '../lib/auth'

interface HeaderProps {
  usingLiveData?: boolean
  section?: string
}

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/generator', label: 'Generator' },
  { href: '/history', label: 'History' },
]

export default function Header({ usingLiveData = false, section }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const session = readAuthSession()
    setEmail(session?.email ?? null)
  }, [pathname])

  const handleLogout = () => {
    clearAuthSession()
    setEmail(null)
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-muted border border-primary/15 shadow-lg shadow-primary/10 transition group-hover:scale-105">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">
                INTELLiINVEST
              </h1>
              <p className="text-xs text-foreground-muted">
                AI Financial Advisory Simulator
              </p>
            </div>
          </Link>

          {section ? (
            <span className="hidden md:inline-flex rounded-full bg-primary-muted px-3 py-1 text-[11px] font-semibold text-primary uppercase tracking-[0.2em]">
              {section}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background-secondary text-foreground-secondary hover:bg-card-hover hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            )
          })}

          {email ? (
            <>
              <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground-secondary">
                {email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full bg-danger-muted px-3 py-1.5 text-xs font-medium text-danger transition hover:bg-danger/20"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground-secondary transition hover:bg-card-hover hover:text-foreground"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:bg-primary-hover"
              >
                Register
              </Link>
            </>
          )}

          {usingLiveData ? (
            <div className="flex items-center gap-2 rounded-full bg-success-muted px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              <span className="text-xs font-medium text-success">Live Market</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-full bg-warning-muted px-3 py-1.5">
              <Activity className="w-3 h-3 text-warning" />
              <span className="text-xs font-medium text-warning">RAMENS</span>
            </div>
          )}

          <span className="hidden xl:inline text-xs text-foreground-muted font-mono">
            JWT secured
          </span>
        </div>
      </div>
    </header>
  )
}
