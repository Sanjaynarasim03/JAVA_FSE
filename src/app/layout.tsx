import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Financial Advisor - Indian Stock Market',
  description: 'Data-driven portfolio allocation for Indian stocks with risk-adjusted returns',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-gray-900 antialiased`}>
        <div className="min-h-screen text-gray-900">
          {children}
        </div>
      </body>
    </html>
  )
}
