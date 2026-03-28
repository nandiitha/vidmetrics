'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { EnrichedVideo } from '@/lib/youtube'
import { fmtNum } from '@/lib/utils'

const TREND_COLORS: Record<string, string> = {
  hot:    '#0F9D74',
  rising: '#3b82f6',
  steady: '#555550',
  fading: '#e24b4a',
}

interface Props {
  videos: EnrichedVideo[]
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null
  const d = payload[0].payload
  return (
    <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-3 text-xs font-mono max-w-[240px]">
      <p className="text-white mb-1 leading-snug" style={{ fontSize: 11 }}>{d.title}</p>
      <p className="text-accent">{fmtNum(d.velocity)}/day</p>
      <p className="text-muted">{fmtNum(d.views)} total · {d.daysAgo}d old</p>
    </div>
  )
}

export default function VelocityChart({ videos }: Props) {
  const sorted = [...videos].sort((a, b) => b.velocity - a.velocity).slice(0, 12)
  const data = sorted.map(v => ({
    ...v,
    label: v.title.length > 22 ? v.title.slice(0, 22) + '…' : v.title,
  }))

  return (
    <div className="vm-panel p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif italic font-light text-base text-white">
          View velocity by video
        </h2>
        <span className="vm-label">views / day since publish</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 40 }}>
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fontFamily: 'DM Mono', fill: '#888780' }}
            angle={-30}
            textAnchor="end"
            interval={0}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={fmtNum}
            tick={{ fontSize: 10, fontFamily: 'DM Mono', fill: '#888780' }}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="velocity" radius={[3, 3, 0, 0]}>
            {data.map((v, i) => (
              <Cell key={i} fill={TREND_COLORS[v.trend] || '#555'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-1 flex-wrap">
        {Object.entries(TREND_COLORS).map(([t, c]) => (
          <span key={t} className="flex items-center gap-1.5 text-[10px] text-muted font-mono">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: c }} />
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </span>
        ))}
      </div>
    </div>
  )
}
