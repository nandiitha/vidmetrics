'use client'

import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'

const DEMOS = ['@mkbhd', '@veritasium', '@kurzgesagt', '@LinusTechTips', '@MrBeast']

interface Props {
  onAnalyze: (url: string) => void
  loading: boolean
}

export default function ChannelInput({ onAnalyze, loading }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && !loading) onAnalyze(value.trim())
  }

  return (
    <div className="vm-panel p-5 mb-6">
      <span className="vm-label block mb-3">Competitor channel URL or handle</span>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            className="vm-input pl-9"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="https://youtube.com/@mkbhd  or  @veritasium  or  UCxxxxxxx"
            disabled={loading}
            autoFocus
          />
        </div>
        <button type="submit" className="vm-btn-primary" disabled={loading || !value.trim()}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Fetching...
            </span>
          ) : (
            'Analyze →'
          )}
        </button>
      </form>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className="vm-label">Try:</span>
        {DEMOS.map(handle => (
          <button
            key={handle}
            onClick={() => { setValue(handle); onAnalyze(handle) }}
            disabled={loading}
            className="text-[11px] px-2.5 py-1 rounded-full border border-border text-muted
              hover:border-accent hover:text-accent transition-all duration-100 font-mono
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {handle}
          </button>
        ))}
      </div>
    </div>
  )
}
