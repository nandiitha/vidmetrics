import Image from 'next/image'
import { ChannelInfo } from '@/lib/youtube'
import { fmtNum } from '@/lib/utils'
import { ExternalLink } from 'lucide-react'

interface Props {
  channel: ChannelInfo
  window: string
}

export default function ChannelHeader({ channel, window }: Props) {
  return (
    <div className="vm-panel flex items-center gap-4 p-4 mb-6">
      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-[#222]">
        {channel.thumbnail ? (
          <Image src={channel.thumbnail} alt={channel.name} fill style={{ objectFit: 'cover' }} unoptimized />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-accent font-serif italic text-xl">
            {channel.name[0]}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-white text-sm font-mono font-medium truncate">{channel.name}</h1>
          <a
            href={`https://youtube.com/${channel.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-accent transition-colors flex-shrink-0"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="text-[11px] text-muted mt-0.5 font-mono">
          {channel.handle} · {fmtNum(channel.subscribers)} subscribers · {fmtNum(channel.totalViews)} total views
        </div>
      </div>

      <div className="ml-auto flex-shrink-0">
        <span className="text-[10px] px-2 py-1 rounded border border-border text-muted font-mono uppercase tracking-wider">
          {window}
        </span>
      </div>
    </div>
  )
}
