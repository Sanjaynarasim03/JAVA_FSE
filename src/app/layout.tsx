import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'INTELLiINVEST - AI-Powered Indian Stock Market Portfolio',
  description: 'Data-driven portfolio allocation for Indian stocks with real-time data, risk-adjusted returns, and AI-powered recommendations.',
}

export const viewport: Viewport = {
  themeColor: '#080C14',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
