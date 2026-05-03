'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, UserPlus } from 'lucide-react'

export interface AuthFormValues {
  name?: string
  email: string
  password: string
}

interface AuthFormProps {
  mode: 'login' | 'register'
  loading: boolean
  error?: string | null
  onSubmit: (values: AuthFormValues) => Promise<void> | void
}

export default function AuthForm({ mode, loading, error, onSubmit }: AuthFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit({
      name: mode === 'register' ? name.trim() : undefined,
      email: email.trim(),
      password,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card/95 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-muted text-primary">
          {mode === 'register' ? <UserPlus className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {mode === 'register' ? 'Create your INTELLiINVEST account' : 'Welcome back'}
          </h2>
          <p className="text-sm text-foreground-secondary">
            {mode === 'register'
              ? 'Create a JWT-protected account to save portfolios in CSV storage.'
              : 'Sign in to generate and review RAMENS portfolios.'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {mode === 'register' ? (
          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground-secondary">Full name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              type="text"
              placeholder="Aarav Mehta"
              className="w-full rounded-2xl border border-border bg-background-secondary px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              required
            />
          </label>
        ) : null}

        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground-secondary">Email address</span>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-border bg-background-secondary px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground-secondary">Password</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Minimum 8 characters"
            className="w-full rounded-2xl border border-border bg-background-secondary px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            required
          />
        </label>

        {error ? (
          <div className="rounded-2xl border border-danger/20 bg-danger-muted px-4 py-3 text-sm text-danger">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Please wait...' : mode === 'register' ? 'Create account' : 'Sign in'}
          {!loading ? <ArrowRight className="h-4 w-4" /> : null}
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-warning/20 bg-warning-muted p-4 text-xs leading-relaxed text-foreground-secondary">
        <p className="mb-1 font-semibold text-warning">Risk warning</p>
        <p>
          This is an AI-based simulation and not financial advice. Generate portfolios only after reviewing the methodology and risk disclosures.
        </p>
      </div>

      <div className="mt-6 text-center text-sm text-foreground-secondary">
        {mode === 'register' ? (
          <>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            Need an account?{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </form>
  )
}
