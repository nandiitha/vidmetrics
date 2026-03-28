import { fmtNum, fmtVelocity } from '@/lib/utils'

interface Props {
  totalViews30d: number
  avgVelocity: number
  avgEngagement: number
  trendingCount: number
  videoCount: number
}

export default function StatCards({ totalViews30d, avgVelocity, avgEngagement, trendingCount, videoCount }: Props) {
  const stats = [
    {
      label: 'Total views (30d)',
      value: fmtNum(totalViews30d),
      sub: `across ${videoCount} videos`,
    },
    {
      label: 'Avg view velocity',
      value: fmtVelocity(avgVelocity),
      sub: 'views per day per video',
    },
    {
      label: 'Avg engagement',
      value: avgEngagement.toFixed(1) + '%',
      sub: '(likes + comments) / views',
    },
    {
      label: 'Trending now',
      value: `${trendingCount} / ${videoCount}`,
      sub: 'Hot or Rising this month',
      accent: trendingCount > 0,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {stats.map(s => (
        <div key={s.label} className="vm-panel p-4">
          <span className="vm-label block mb-2">{s.label}</span>
          <div className={`text-2xl font-mono font-normal leading-none ${s.accent ? 'text-accent' : 'text-white'}`}>
            {s.value}
          </div>
          <div className="text-[10px] text-muted mt-2 font-mono">{s.sub}</div>
        </div>
      ))}
    </div>
  )
}
