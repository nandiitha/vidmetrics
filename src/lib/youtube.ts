const YT_API = 'https://www.googleapis.com/youtube/v3'
const API_KEY = process.env.YOUTUBE_API_KEY

export interface ChannelInfo {
  id: string
  name: string
  handle: string
  thumbnail: string
  subscribers: number
  totalViews: number
  videoCount: number
  description: string
}

export interface VideoStats {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  daysAgo: number
  views: number
  likes: number
  comments: number
  duration: string
  durationSeconds: number
}

export type TrendLabel = 'hot' | 'rising' | 'steady' | 'fading'

export interface EnrichedVideo extends VideoStats {
  velocity: number          // views per day
  engagementRate: number    // (likes + comments) / views * 100
  trend: TrendLabel
}

// Parse ISO 8601 duration (PT1H2M3S) to seconds
function parseDuration(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return 0
  return (parseInt(m[1] || '0') * 3600) + (parseInt(m[2] || '0') * 60) + parseInt(m[3] || '0')
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function daysAgo(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime()
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)))
}

function calcTrend(velocity: number, daysAgo: number): TrendLabel {
  if (daysAgo <= 5 && velocity > 400000) return 'hot'
  if (daysAgo <= 5 && velocity > 100000) return 'hot'
  if (daysAgo <= 14 && velocity > 150000) return 'rising'
  if (daysAgo <= 14 && velocity > 50000) return 'rising'
  if (velocity > 30000) return 'steady'
  return 'fading'
}

// Resolve channel ID from URL or handle
export async function resolveChannelId(input: string): Promise<string> {
  // Extract handle or ID from URL
  let identifier = input.trim()

  // Strip URL parts
  identifier = identifier
    .replace(/https?:\/\/(www\.)?youtube\.com\//i, '')
    .replace(/\/$/, '')
    .trim()

  // Already a raw channel ID (UCxxxxx)
  if (/^UC[\w-]{22}$/.test(identifier)) return identifier

  // Handle @username format
  const handleMatch = identifier.match(/^@?([\w.-]+)$/) ||
                      identifier.match(/^channel\/@([\w.-]+)$/) ||
                      identifier.match(/^@([\w.-]+)$/)

  if (handleMatch || identifier.startsWith('@')) {
    const handle = identifier.startsWith('@') ? identifier : '@' + (handleMatch?.[1] ?? identifier)
    const res = await fetch(
      `${YT_API}/channels?part=id&forHandle=${encodeURIComponent(handle)}&key=${API_KEY}`
    )
    const data = await res.json()
    if (data.items?.[0]?.id) return data.items[0].id
  }

  // Try as username (legacy)
  const res = await fetch(
    `${YT_API}/channels?part=id&forUsername=${encodeURIComponent(identifier)}&key=${API_KEY}`
  )
  const data = await res.json()
  if (data.items?.[0]?.id) return data.items[0].id

  throw new Error(`Could not resolve channel from: "${input}". Try using @handle format.`)
}

export async function fetchChannelInfo(channelId: string): Promise<ChannelInfo> {
  const res = await fetch(
    `${YT_API}/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`
  )
  const data = await res.json()
  if (!data.items?.[0]) throw new Error('Channel not found')

  const ch = data.items[0]
  return {
    id: ch.id,
    name: ch.snippet.title,
    handle: ch.snippet.customUrl || `@${ch.snippet.title}`,
    thumbnail: ch.snippet.thumbnails?.medium?.url || ch.snippet.thumbnails?.default?.url || '',
    subscribers: parseInt(ch.statistics.subscriberCount || '0'),
    totalViews: parseInt(ch.statistics.viewCount || '0'),
    videoCount: parseInt(ch.statistics.videoCount || '0'),
    description: ch.snippet.description || '',
  }
}

export async function fetchRecentVideos(channelId: string, maxResults = 20): Promise<EnrichedVideo[]> {
  // 1. Get uploads playlist ID
  const chRes = await fetch(
    `${YT_API}/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`
  )
  const chData = await chRes.json()
  const uploadsId = chData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
  if (!uploadsId) throw new Error('Could not find uploads playlist')

  // 2. Get recent video IDs from uploads playlist
  const plRes = await fetch(
    `${YT_API}/playlistItems?part=contentDetails,snippet&playlistId=${uploadsId}&maxResults=${maxResults}&key=${API_KEY}`
  )
  const plData = await plRes.json()
  const items = plData.items || []

  // Filter to last 30 days
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  const recentItems = items.filter((item: any) => {
    const published = new Date(item.contentDetails.videoPublishedAt).getTime()
    return published >= thirtyDaysAgo
  })

  if (recentItems.length === 0) return []

  const videoIds = recentItems.map((item: any) => item.contentDetails.videoId).join(',')

  // 3. Get full stats for each video
  const vRes = await fetch(
    `${YT_API}/videos?part=statistics,contentDetails,snippet&id=${videoIds}&key=${API_KEY}`
  )
  const vData = await vRes.json()

  const enriched: EnrichedVideo[] = (vData.items || []).map((v: any) => {
    const days = daysAgo(v.snippet.publishedAt)
    const views = parseInt(v.statistics.viewCount || '0')
    const likes = parseInt(v.statistics.likeCount || '0')
    const comments = parseInt(v.statistics.commentCount || '0')
    const durationSec = parseDuration(v.contentDetails.duration)
    const velocity = Math.round(views / days)
    const engagementRate = views > 0 ? parseFloat(((likes + comments) / views * 100).toFixed(2)) : 0

    return {
      id: v.id,
      title: v.snippet.title,
      thumbnail: v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url || '',
      publishedAt: v.snippet.publishedAt,
      daysAgo: days,
      views,
      likes,
      comments,
      duration: formatDuration(durationSec),
      durationSeconds: durationSec,
      velocity,
      engagementRate,
      trend: calcTrend(velocity, days),
    }
  })

  return enriched.sort((a, b) => b.velocity - a.velocity)
}
