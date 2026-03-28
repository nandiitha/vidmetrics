import Image from 'next/image'
import { EnrichedVideo } from '@/lib/youtube'
import { fmtNum, TREND_CONFIG, TrendLabel } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'

interface Props {
  video: EnrichedVideo
}

export default function TopPerformer({ video }: Props) {
  const trend = TREND_CONFIG[video.trend as TrendLabel]

  return (
    <div className="vm-panel p-5 mb-6 border-accent/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-accent rounded-l-xl" />
      <div className="flex items-start gap-4">
        <div className="relative w-24 h-16 rounded-lg flex-shrink-0 overflow-hidden bg-[#222]">
          {video.thumbnail ? (
            <Image
              src={video.thumbnail}
              alt=""
              fill
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-2xl">▶</div>
          )}
        </div>
     <div className="flex-1 min-w-0">
  <div className="flex items-center gap-2 mb-1">
    <TrendingUp className="w-3 h-3 text-accent flex-shrink-0" />
    <span className="vm-label text-accent">Top performer this month</span>
  </div>
  <a
    href={`https://youtube.com/watch?v=${video.id}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-white text-sm font-mono hover:text-accent transition-colors line-clamp-2 leading-snug block mb-2"
  >
    {video.title}
  </a>
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <div className="text-2xl font-mono text-white leading-none">
                {fmtNum(video.velocity)}
                <span className="text-sm text-muted ml-1">/day</span>
              </div>
              <div className="vm-label mt-0.5">view velocity</div>
            </div>
            <div>
              <div className="text-2xl font-mono text-white leading-none">
                {fmtNum(video.views)}
              </div>
              <div className="vm-label mt-0.5">total views</div>
            </div>
            <div>
              <div className="text-2xl font-mono text-white leading-none">
                {video.engagementRate.toFixed(1)}
                <span className="text-sm text-muted ml-0.5">%</span>
              </div>
              <div className="vm-label mt-0.5">engagement</div>
            </div>
            <span className={`text-[11px] px-2 py-1 rounded-full ${trend?.className}`}>
              {trend?.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}