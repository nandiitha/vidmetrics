export function fmtNum(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B'
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K'
  return n.toLocaleString()
}

export function fmtVelocity(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M/day'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K/day'
  return n + '/day'
}

export type TrendLabel = 'hot' | 'rising' | 'steady' | 'fading'

export const TREND_CONFIG: Record<TrendLabel, { label: string; className: string }> = {
  hot:     { label: '↑↑ Hot',    className: 'bg-[#0a2e22] text-[#34d399] border border-[#0f4d33]' },
  rising:  { label: '↑ Rising',  className: 'bg-[#0a1e30] text-[#60a5fa] border border-[#1a3a5c]' },
  steady:  { label: '— Steady',  className: 'bg-[#1a1a1a] text-[#888780] border border-[#2e2e2e]' },
  fading:  { label: '↓ Fading',  className: 'bg-[#2e1010] text-[#f87171] border border-[#4a1a1a]' },
}
