# VidMetrics — Competitor Intelligence

A clean, fast YouTube competitor analysis tool built for enterprise creators and agencies. Paste a channel URL and instantly see which videos are gaining traction this month — sorted by view velocity, engagement rate, and trending signals.

![VidMetrics Dashboard](https://via.placeholder.com/1200x600/0e0e0e/0F9D74?text=VidMetrics+Dashboard)

---

## Features

- **Channel analysis** — resolve any YouTube URL, @handle, or channel ID
- **View velocity** — views per day since publish (the core "crushing it" metric)
- **Engagement rate** — (likes + comments) / views, per video
- **Trend classification** — Hot / Rising / Steady / Fading, based on velocity + age
- **Sortable table** — click any column header to re-sort
- **Search + filter** — filter by title keyword or trend status
- **Velocity chart** — bar chart of all videos, color-coded by trend
- **CSV export** — one-click download of full dataset
- **Responsive** — works on mobile and tablet

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 14 (App Router) | API routes keep the YouTube key server-side |
| Styling | Tailwind CSS | Utility-first, fast to iterate |
| Charts | Recharts | Composable, works well with React |
| Icons | Lucide React | Consistent, lightweight |
| Deploy | Vercel | Native Next.js support, env vars built-in |
| Data | YouTube Data API v3 | Official, reliable, 10k quota/day free |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/vidmetrics.git
cd vidmetrics
```

### 2. Install dependencies

```bash
npm install
```

### 3. Get a YouTube API key

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (e.g. `vidmetrics`)
3. **APIs & Services → Library** → search `YouTube Data API v3` → Enable
4. **APIs & Services → Credentials → Create Credentials → API Key**
5. Copy the key

### 4. Add your key

```bash
cp .env.local.example .env.local
```

Open `.env.local` and replace the placeholder:

```
YOUTUBE_API_KEY=AIza...your_real_key_here
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel)

```bash
npm i -g vercel
vercel
```

When prompted, add the environment variable:
- **Key:** `YOUTUBE_API_KEY`
- **Value:** your API key

Or connect your GitHub repo to [vercel.com](https://vercel.com) and add the env var in **Project Settings → Environment Variables**.

---

## Project Structure

```
src/
├── app/
│   ├── api/channel/route.ts   # YouTube API proxy (server-side)
│   ├── globals.css            # Base styles + font imports
│   ├── layout.tsx             # Root layout + metadata
│   └── page.tsx               # Main dashboard page
├── components/
│   ├── ChannelInput.tsx       # URL input + quick-load demos
│   ├── ChannelHeader.tsx      # Channel avatar, name, subs
│   ├── StatCards.tsx          # 4 KPI summary cards
│   ├── VelocityChart.tsx      # Recharts bar chart
│   └── VideoTable.tsx         # Sortable, filterable video table
└── lib/
    ├── youtube.ts             # YouTube API calls + data enrichment
    └── utils.ts               # Number formatters, trend config
```

---

## How I Built This

**Time:** ~4 hours end to end

**Approach:**
1. Started with the core data model — what does "crushing it" actually mean? Landed on **view velocity** (views/day) as the primary signal, since raw view count favors older videos unfairly.
2. Built the API layer first (`src/lib/youtube.ts`) before touching the UI — this kept data concerns separate from presentation.
3. Used Next.js API routes as a thin proxy so the YouTube key never reaches the browser.
4. Designed the UI around a single color accent (`#0F9D74`) with a monospaced font (`DM Mono`) to give it a calm, analytical feel — like a Bloomberg terminal, not a startup landing page.
5. Added CSV export as a one-liner since enterprise clients always want to pull data into their own tools.

**AI tools used:**
- Claude (Anthropic) — architecture decisions, component structure, YouTube API integration patterns
- Used AI to accelerate boilerplate (table sorting logic, chart config) while writing business logic manually

**What I'd add in v2:**
- Cross-channel comparison (overlay two competitors side by side)
- Sparkline per video showing daily velocity over time
- Category/topic clustering using video tags
- Shareable report URL (serialize state to query params)
- Webhook alert when a competitor's video crosses a velocity threshold

---

## API Quota

The YouTube Data API v3 has a free quota of **10,000 units/day**. Each channel analysis uses approximately 3 requests (~5 units total). You won't hit limits in normal demo/dev usage.

---

## License

MIT
