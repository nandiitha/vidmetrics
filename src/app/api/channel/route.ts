import { NextRequest, NextResponse } from 'next/server'
import { resolveChannelId, fetchChannelInfo, fetchRecentVideos } from '@/lib/youtube'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const input = searchParams.get('channel')?.trim()

  if (!input) {
    return NextResponse.json({ error: 'Missing channel parameter' }, { status: 400 })
  }

  if (!process.env.YOUTUBE_API_KEY) {
    return NextResponse.json(
      { error: 'YouTube API key not configured. Add YOUTUBE_API_KEY to your .env.local file.' },
      { status: 500 }
    )
  }

  try {
    const channelId = await resolveChannelId(input)
    const [channel, videos] = await Promise.all([
      fetchChannelInfo(channelId),
      fetchRecentVideos(channelId, 25),
    ])

    // Compute summary stats
    const totalViews30d = videos.reduce((s, v) => s + v.views, 0)
    const avgVelocity = videos.length
      ? Math.round(videos.reduce((s, v) => s + v.velocity, 0) / videos.length)
      : 0
    const avgEngagement = videos.length
      ? parseFloat((videos.reduce((s, v) => s + v.engagementRate, 0) / videos.length).toFixed(2))
      : 0
    const trendingCount = videos.filter(v => v.trend === 'hot' || v.trend === 'rising').length

    return NextResponse.json({
      channel,
      videos,
      summary: { totalViews30d, avgVelocity, avgEngagement, trendingCount, videoCount: videos.length },
    })
  } catch (err: any) {
    const message = err?.message || 'Failed to fetch channel data'
    const isQuota = message.includes('quota')
    return NextResponse.json(
      { error: isQuota ? 'YouTube API quota exceeded. Try again tomorrow.' : message },
      { status: 400 }
    )
  }
}
