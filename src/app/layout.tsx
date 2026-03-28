import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VidMetrics — Competitor Intelligence',
  description: 'Analyze competitor YouTube channel performance. View velocity, engagement, and trending signals.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
