'use client'

import { useState, useEffect } from 'react'
import { Search, Loader2, Clock, X } from 'lucide-react'

const DEMOS = ['@mkbhd', '@veritasium', '@kurzgesagt', '@LinusTechTips', '@MrBeast']
const HISTORY_KEY = 'vm_search_history'

interface Props {
  onAnalyze: (url: string) => void
  loading: boolean
}

export default function ChannelInput({ onAnalyze, loading }: Props) {
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY)
      if (stored) setHistory(JSON.parse(stored))
    } catch {}
  }, [])

  function saveToHistory(input: string) {
    try {
      const clean = input.trim()
      const updated = [clean, ...history.filter(h => h !== clean)].slice(0, 5)
      setHistory(updated)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
    } catch {}
  }

  function removeFromHistory(item: string) {
    const updated = history.filter(h => h !== item)
    setHistory(updated)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim() && !loading) {
      saveToHistory(value.trim())
      onAnalyze(value.trim())
    }
  }

  function handleQuick(handle: string) {
    setValue(handle)
    saveToHistory(handle)
    onAnalyze(handle)
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
            placeholder="https://youtube.com/@mkbhd  or  @veritasium"
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

      {/* Search history */}
      {history.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-3 h-3 text-muted" />
            <span className="vm-label">Recent</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {history.map(item => (
              <div key={item} className="flex items-center gap-1 group">
                <button
                  onClick={() => handleQuick(item)}
                  disabled={loading}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-border text-muted
                    hover:border-accent hover:text-accent transition-all duration-100 font-mono
                    disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {item}
                </button>
                <button
                  onClick={() => removeFromHistory(item)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Demo channels */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className="vm-label">Try:</span>
        {DEMOS.map(handle => (
          <button
            key={handle}
            onClick={() => handleQuick(handle)}
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