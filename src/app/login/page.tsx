'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import AuthForm, { AuthFormValues } from '../../components/AuthForm'
import { apiRequest } from '../../lib/backend'
import { persistAuthSession, readAuthSession } from '../../lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (readAuthSession()) {
      router.replace('/dashboard')
    }
  }, [router])

  const handleSubmit = async ({ email, password }: AuthFormValues) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiRequest<{
        access_token: string
        token_type: 'bearer'
        user: { email: string; name: string }
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      persistAuthSession({
        access_token: response.access_token,
        token_type: response.token_type,
        email: response.user.email,
        name: response.user.name,
      })

      router.push('/dashboard')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header section="login" />
      <main className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <section className="space-y-6">
          <div className="inline-flex rounded-full border border-primary/20 bg-primary-muted px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Secure access
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Sign in to generate portfolios and view history.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-foreground-secondary">
            INTELLiINVEST uses JWT-protected APIs, bcrypt password hashing, and CSV-backed storage so you can work offline without cloud dependencies.
          </p>
          <div className="rounded-3xl border border-border bg-card/90 p-5">
            <p className="text-sm font-semibold text-foreground">Protected features</p>
            <p className="mt-2 text-sm leading-6 text-foreground-secondary">
              Dashboard, generator, and portfolio history all require a valid bearer token.
            </p>
          </div>
        </section>

        <AuthForm mode="login" loading={loading} error={error} onSubmit={handleSubmit} />
      </main>
    </div>
  )
}
