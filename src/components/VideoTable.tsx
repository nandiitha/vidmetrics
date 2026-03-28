              'use client'

              import { useState, useMemo } from 'react'
              import Image from 'next/image'
              import { EnrichedVideo } from '@/lib/youtube'
              import { fmtNum, fmtVelocity, TREND_CONFIG, TrendLabel } from '@/lib/utils'
              import { ExternalLink } from 'lucide-react'

              type SortField = 'velocity' | 'views' | 'engagementRate' | 'daysAgo' | 'title'
              type SortDir = 1 | -1

              interface Props {
                videos: EnrichedVideo[]
                onExport: () => void
              }

              function MiniBar({ pct, low }: { pct: number; low?: boolean }) {
                return (
                  <div className="h-[3px] rounded-full bg-[#2a2a2a] w-20 mt-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: low ? '#e24b4a' : '#0F9D74',
                      }}
                    />
                  </div>
                )
              }

              export default function VideoTable({ videos, onExport }: Props) {
                const [sortField, setSortField] = useState<SortField>('velocity')
                const [sortDir, setSortDir] = useState<SortDir>(-1)
                const [query, setQuery] = useState('')
                const [trendFilter, setTrendFilter] = useState('all')

                const maxViews = useMemo(() => Math.max(...videos.map(v => v.views)), [videos])
                const maxVel = useMemo(() => Math.max(...videos.map(v => v.velocity)), [videos])

                const sorted = useMemo(() => {
                  let result = videos.filter(v => {
                    const matchQ = !query || v.title.toLowerCase().includes(query.toLowerCase())
                    const matchT = trendFilter === 'all' || v.trend === trendFilter
                    return matchQ && matchT
                  })

                  result.sort((a, b) => {
                    const va = a[sortField as keyof EnrichedVideo] as number | string
                    const vb = b[sortField as keyof EnrichedVideo] as number | string
                    if (typeof va === 'string') return sortDir * (va as string).localeCompare(vb as string)
                    return sortDir * ((va as number) - (vb as number))
                  })

                  return result
                }, [videos, query, trendFilter, sortField, sortDir])

                function handleSort(field: SortField) {
                  if (sortField === field) setSortDir(d => (d === -1 ? 1 : -1))
                  else { setSortField(field); setSortDir(-1) }
                }

                function thClass(field: SortField) {
                  return `vm-label text-left px-4 py-3 cursor-pointer select-none whitespace-nowrap hover:text-white transition-colors
                    ${sortField === field ? 'text-accent' : ''}`
                }

                function sortIcon(field: SortField) {
                  if (sortField !== field) return <span className="opacity-30 ml-1">↕</span>
                  return <span className="text-accent ml-1">{sortDir === -1 ? '↓' : '↑'}</span>
                }

                return (
                  <div>
                    {/* Controls */}
                    <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
                      <h2 className="font-serif italic font-light text-base text-white">
                        Videos this month
                        <span className="font-mono font-normal text-sm text-muted ml-2 not-italic">
                          ({sorted.length})
                        </span>
                      </h2>
                      <div className="flex items-center gap-2 flex-wrap">
                        <input
                          className="vm-input h-8 text-xs w-44"
                          placeholder="Search titles..."
                          value={query}
                          onChange={e => setQuery(e.target.value)}
                        />
                        <select
                          className="vm-select"
                          value={trendFilter}
                          onChange={e => setTrendFilter(e.target.value)}
                        >
                          <option value="all">All trends</option>
                          <option value="hot">Hot only</option>
                          <option value="rising">Rising</option>
                          <option value="steady">Steady</option>
                          <option value="fading">Fading</option>
                        </select>
                        <button className="vm-btn-ghost" onClick={onExport}>
                          Export CSV ↓
                        </button>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="vm-panel overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-mono border-collapse">
                          <thead>
                            <tr className="border-b border-border">
                              <th className={thClass('title')} onClick={() => handleSort('title')}>
                                Video {sortIcon('title')}
                              </th>
                              <th className={thClass('views')} onClick={() => handleSort('views')}>
                                Views {sortIcon('views')}
                              </th>
                              <th className={`${thClass('velocity')} hidden sm:table-cell`} onClick={() => handleSort('velocity')}>
  Velocity/day {sortIcon('velocity')}
</th>
                            <th className={`${thClass('engagementRate')} hidden sm:table-cell`} onClick={() => handleSort('engagementRate')}>
                Eng. rate {sortIcon('engagementRate')}
              </th>
              <th className={`${thClass('daysAgo')} hidden sm:table-cell`} onClick={() => handleSort('daysAgo')}>
                Age {sortIcon('daysAgo')}
              </th>
                              <th className="vm-label text-left px-4 py-3">Trend</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sorted.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="text-center py-12 text-muted">
                                  No videos match your filters.
                                </td>
                              </tr>
                            ) : (
                              sorted.map(v => {
                                const vPct = Math.round(v.views / maxViews * 100)
                                const velPct = Math.round(v.velocity / maxVel * 100)
                                const trend = TREND_CONFIG[v.trend as TrendLabel]

                                return (
                                  <tr
                                    key={v.id}
                                    className="border-b border-border last:border-0 hover:bg-[#1a1a1a] transition-colors"
                                  >
                                    {/* Title */}
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-3" style={{ maxWidth: 340 }}>
                                        <div className="relative w-14 h-9 rounded flex-shrink-0 overflow-hidden bg-[#222]">
                                          {v.thumbnail ? (
                                            <Image
                                              src={v.thumbnail}
                                              alt=""
                                              fill
                                              style={{ objectFit: 'cover' }}
                                              unoptimized
                                            />
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted text-lg">▶</div>
                                          )}
                                        </div>
                                        <div className="min-w-0">
                                          <a
                                            href={`https://youtube.com/watch?v=${v.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white hover:text-accent transition-colors line-clamp-2 leading-snug block text-[12px]"
                                          >
                                            {v.title}
                                          </a>
                                          <div className="text-[10px] text-muted mt-0.5">
                                            {v.duration} · {v.daysAgo}d ago
                                          </div>
                                        </div>
                                      </div>
                                    </td>

                                    {/* Views */}
                                    <td className="px-4 py-3 whitespace-nowrap">
                                      <div className="text-white text-[13px]">{fmtNum(v.views)}</div>
                                      <MiniBar pct={vPct} />
                                    </td>

                                    {/* Velocity */}
                                   {/* Velocity */}
<td className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
  <div className="text-white text-[13px]">{fmtNum(v.velocity)}</div>
  <MiniBar pct={velPct} low={velPct < 25} />
</td>

                                    {/* Engagement */}
                                  <td className="px-4 py-3 whitespace-nowrap text-[13px] text-white hidden sm:table-cell">
                {v.engagementRate.toFixed(1)}%
              </td>
              {/* Age */}
              <td className="px-4 py-3 whitespace-nowrap text-muted text-[12px] hidden sm:table-cell">
                {v.daysAgo}d
              </td>

                                    {/* Trend */}
                                   <td className="px-4 py-3 whitespace-nowrap">
  <span className={`text-[11px] px-2 py-1 rounded-full ${trend?.className}`}>
    {trend?.label}
  </span>
</td>
                                  </tr>
                                )
                              })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )
              }
