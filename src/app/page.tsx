'use client'

import Link from 'next/link'
import { AlertTriangle, ArrowRight, BadgeCheck, BarChart3, Layers3, LockKeyhole, Shield, Sparkles } from 'lucide-react'
import Header from '../components/Header'

const FEATURES = [
  {
    title: 'RAMENS engine',
    description: 'Risk-aware multi-factor ensemble scoring with momentum, fundamentals, inverse beta, factor blend, and macro context.',
    icon: Sparkles,
  },
  {
    title: 'JWT protection',
    description: 'Portfolio endpoints stay behind login and only accept signed bearer tokens.',
    icon: LockKeyhole,
  },
  {
    title: 'CSV persistence',
    description: 'User portfolios are stored locally in data/portfolios.csv for offline-friendly history tracking.',
    icon: Layers3,
  },
  {
    title: 'Explainable output',
    description: 'Every recommendation includes a score, rationale, risk indicator, and clear methodology notes.',
    icon: BadgeCheck,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header usingLiveData={false} section="landing" />

      <main className="flex-1">
        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-success-muted px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-success">
              AI Generated
            </div>
            <div className="space-y-4">
              <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                INTELLiINVEST builds a protected, explainable financial advisory simulator.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-foreground-secondary sm:text-lg">
                Register, sign in, and generate RAMENS portfolios that are stored locally in CSV format. The platform is fully offline-friendly, JWT protected, and designed to surface clear risk and methodology signals.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/generator" className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-card-hover">
                Open generator
                <BarChart3 className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-border bg-card/90 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground-muted">Security</p>
                <p className="mt-2 text-lg font-semibold text-foreground">JWT + bcrypt</p>
                <p className="mt-1 text-sm text-foreground-secondary">Password hashing and bearer-token protection on portfolio APIs.</p>
              </div>
              <div className="rounded-3xl border border-border bg-card/90 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground-muted">Storage</p>
                <p className="mt-2 text-lg font-semibold text-foreground">Local CSV</p>
                <p className="mt-1 text-sm text-foreground-secondary">History is written to data/portfolios.csv with no cloud dependency.</p>
              </div>
              <div className="rounded-3xl border border-border bg-card/90 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground-muted">Advisor</p>
                <p className="mt-2 text-lg font-semibold text-foreground">RAMENS</p>
                <p className="mt-1 text-sm text-foreground-secondary">Risk-aware scoring that blends five portfolio factors into ranked recommendations.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-foreground-muted">What you get</p>
                <h3 className="mt-1 text-xl font-bold text-foreground">Production-style workflow</h3>
              </div>
              <div className="rounded-2xl bg-primary-muted p-3 text-primary">
                <Shield className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-3">
              {FEATURES.map((feature) => {
                const Icon = feature.icon
                return (
                  <div key={feature.title} className="flex gap-4 rounded-2xl border border-border bg-background-secondary/80 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-muted text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{feature.title}</p>
                      <p className="mt-1 text-sm leading-6 text-foreground-secondary">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="rounded-2xl border border-warning/20 bg-warning-muted p-4">
              <div className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-4 w-4" />
                <p className="text-sm font-semibold">Disclaimer</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-foreground-secondary">
                This is an AI-based simulation and not financial advice. The system explains how scores are formed, but it cannot guarantee returns or protect against losses.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
