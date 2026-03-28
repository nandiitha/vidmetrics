'use client'

import { useState } from 'react'
import ChannelInput from '@/components/ChannelInput'
import ChannelHeader from '@/components/ChannelHeader'
import StatCards from '@/components/StatCards'
import VelocityChart from '@/components/VelocityChart'
import VideoTable from '@/components/VideoTable'
import { ChannelInfo, EnrichedVideo } from '@/lib/youtube'
import TopPerformer from '@/components/TopPerformer'
import HealthScore from '@/components/HealthScore'
import { fmtNum } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

interface AnalysisResult {
  channel: ChannelInfo
  videos: EnrichedVideo[]
  summary: {
    totalViews30d: number
    avgVelocity: number
    avgEngagement: number
    trendingCount: number
    videoCount: number
  }
}

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAnalyze(input: string) {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`/api/channel?channel=${encodeURIComponent(input)}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to fetch channel data')

      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function handleExportCSV() {
    if (!result) return
    const rows = [
      ['Title', 'Views', 'Velocity/day', 'Engagement Rate (%)', 'Age (days)', 'Duration', 'Trend', 'URL'],
      ...result.videos.map(v => [
        `"${v.title.replace(/"/g, '""')}"`,
        v.views,
        v.velocity,
        v.engagementRate.toFixed(2),
        v.daysAgo,
        v.duration,
        v.trend,
        `https://youtube.com/watch?v=${v.id}`,
      ]),
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = `${result.channel.handle}_vidmetrics_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="border-b border-border bg-panel sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-serif italic font-light text-xl text-white tracking-tight">
            Vid<span className="text-accent">Metrics</span>
          </span>
          <span className="text-[10px] uppercase tracking-widest text-muted border border-border rounded-full px-3 py-1 font-mono">
            Competitor Intel
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <ChannelInput onAnalyze={handleAnalyze} loading={loading} />

        {/* Error state */}
        {error && (
          <div className="vm-panel p-4 mb-6 flex items-start gap-3 border-red-900/50 bg-[#1e0e0e]">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 text-sm font-mono">{error}</p>
              <p className="text-muted text-xs mt-1 font-mono">
                Check your API key in .env.local, or try a different channel format like @handle
              </p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="vm-panel h-16" />
            <div className="grid grid-cols-4 gap-3">
              {[...Array(4)].map((_, i) => <div key={i} className="vm-panel h-24" />)}
            </div>
            <div className="vm-panel h-52" />
            <div className="vm-panel h-64" />
          </div>
        )}

        {/* Results */}
      {result && !loading && (
  <>
    <ChannelHeader channel={result.channel} window="Last 30 days" />
    <StatCards {...result.summary} />
    <HealthScore {...result.summary} />
    {result.videos.length > 0 ? (
      <>
        <TopPerformer video={result.videos[0]} />
        <VelocityChart videos={result.videos} />
        <VideoTable videos={result.videos} onExport={handleExportCSV} />
      </>
            ) : (
              <div className="vm-panel p-16 text-center">
                <p className="font-serif italic text-2xl font-light text-muted mb-2">No recent videos</p>
                <p className="text-xs text-muted font-mono">
                  This channel hasn't posted in the last 30 days.
                </p>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <div className="text-center py-24">
            <p className="font-serif italic text-3xl font-light text-[#2a2a2a] mb-3">
              Paste a channel URL above
            </p>
            <p className="text-xs text-muted font-mono max-w-sm mx-auto leading-relaxed">
              Analyze competitor view velocity, engagement rate, and trending signals
              across their last 30 days of content.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="text-[10px] text-muted font-mono uppercase tracking-wider">
            VidMetrics · Competitor Intelligence
          </span>
          <span className="text-[10px] text-muted font-mono">
            Data via YouTube Data API v3
          </span>
        </div>
      </footer>
    </div>
  )
}
