import type { Metadata, Viewport } from 'next'
import './globals.css'
import dynamic from 'next/dynamic'

const AssistantWidget = dynamic(() => import('../components/chat/AssistantWidget'), { ssr: false })

export const metadata: Metadata = {
  title: 'INTELLiINVEST - AI Financial Advisory Simulator',
  description:
    'JWT-protected financial advisory simulator with RAMENS portfolio generation, CSV storage, and explainable recommendations.',
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        {/* Assistant widget available on every page */}
        <AssistantWidget />
      </body>
    </html>
  )
}
