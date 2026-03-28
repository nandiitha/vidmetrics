interface Props {
  avgVelocity: number
  avgEngagement: number
  trendingCount: number
  videoCount: number
}

function calcScore(avgVelocity: number, avgEngagement: number, trendingCount: number, videoCount: number): number {
  const velScore = Math.min(40, (avgVelocity / 500000) * 40)
  const engScore = Math.min(35, (avgEngagement / 8) * 35)
  const trendScore = videoCount > 0 ? (trendingCount / videoCount) * 25 : 0
  return Math.round(velScore + engScore + trendScore)
}

function getLabel(score: number): { label: string; color: string; bg: string } {
  if (score >= 80) return { label: 'Dominant', color: '#0F9D74', bg: '#0a2e22' }
  if (score >= 60) return { label: 'Strong', color: '#60a5fa', bg: '#0a1e30' }
  if (score >= 40) return { label: 'Average', color: '#888780', bg: '#1a1a1a' }
  return { label: 'Weak', color: '#f87171', bg: '#2e1010' }
}

export default function HealthScore({ avgVelocity, avgEngagement, trendingCount, videoCount }: Props) {
  const score = calcScore(avgVelocity, avgEngagement, trendingCount, videoCount)
  const { label, color, bg } = getLabel(score)
  const circumference = 2 * Math.PI * 28
  const filled = (score / 100) * circumference

  return (
    <div className="vm-panel p-5 mb-6 flex items-center gap-6">
      <div className="relative flex-shrink-0 w-20 h-20">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="28" fill="none" stroke="#2a2a2a" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="28"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={`${filled} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-mono font-medium text-white">{score}</span>
        </div>
      </div>
      <div>
        <div className="vm-label mb-1">Channel health score</div>
        <div
          className="text-sm font-mono px-2 py-0.5 rounded inline-block mb-2"
          style={{ color, background: bg }}
        >
          {label}
        </div>
        <div className="text-[11px] text-muted font-mono leading-relaxed">
          Based on view velocity,<br />engagement rate, and trending ratio.
        </div>
      </div>
      <div className="ml-auto hidden sm:flex flex-col gap-2 text-right">
        <div>
          <div className="vm-label">Velocity score</div>
          <div className="text-xs text-white font-mono">{Math.round(Math.min(40, (avgVelocity / 500000) * 40))} / 40</div>
        </div>
        <div>
          <div className="vm-label">Engagement score</div>
          <div className="text-xs text-white font-mono">{Math.round(Math.min(35, (avgEngagement / 8) * 35))} / 35</div>
        </div>
        <div>
          <div className="vm-label">Trending score</div>
          <div className="text-xs text-white font-mono">{Math.round(videoCount > 0 ? (trendingCount / videoCount) * 25 : 0)} / 25</div>
        </div>
      </div>
    </div>
  )
}