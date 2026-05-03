'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import AuthForm, { AuthFormValues } from '../../components/AuthForm'
import { apiRequest } from '../../lib/backend'
import { persistAuthSession, readAuthSession } from '../../lib/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (readAuthSession()) {
      router.replace('/dashboard')
    }
  }, [router])

  const handleSubmit = async ({ name, email, password }: AuthFormValues) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiRequest<{
        access_token: string
        token_type: 'bearer'
        user: { email: string; name: string }
      }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })

      persistAuthSession({
        access_token: response.access_token,
        token_type: response.token_type,
        email: response.user.email,
        name: response.user.name,
      })

      router.push('/dashboard')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to create your account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header section="register" />
      <main className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <section className="space-y-6">
          <div className="inline-flex rounded-full border border-success/20 bg-success-muted px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-success">
            Create account
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Start with a local-first financial advisor.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-foreground-secondary">
            Register once, then keep every generated portfolio in a local CSV ledger with history, timestamps, and risk context.
          </p>
          <div className="rounded-3xl border border-border bg-card/90 p-5">
            <p className="text-sm font-semibold text-foreground">Privacy posture</p>
            <p className="mt-2 text-sm leading-6 text-foreground-secondary">
              Accounts are stored locally, passwords are hashed with bcrypt, and all portfolio APIs stay behind JWT verification.
            </p>
          </div>
        </section>

        <AuthForm mode="register" loading={loading} error={error} onSubmit={handleSubmit} />
      </main>
    </div>
  )
}
