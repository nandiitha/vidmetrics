# VidMetrics — Competitor Intelligence

## Live Demo
[vidmetrics-ze3i.vercel.app]https://vidmetrics-ze3i.vercel.app/

Analyze competitor YouTube channel performance. Paste any channel URL and instantly see which videos are crushing it — view velocity, engagement rate, trending signals, and more.

Built as a take-home project for VidMetrics. Shipped in one session using Next.js, Tailwind, and the YouTube Data API v3.

---

## Features

- **Channel analysis** — resolves any YouTube URL format (`@handle`, `/channel/UCxxx`, or legacy username)
- **Channel health score** — 0–100 score based on velocity, engagement, and trending ratio
- **Top performer card** — pinned highlight of the best video this month
- **View velocity** — views per day since publish, the core "crushing it" signal
- **Trend classification** — Hot, Rising, Steady, Fading based on velocity + video age
- **Engagement rate** — (likes + comments) / views per video
- **Sortable table** — click any column header to sort
- **Search + filter** — filter by title or trend status
- **Search history** — last 5 searches saved locally, one click to reload
- **Velocity chart** — bar chart of all recent videos, color-coded by trend
- **CSV export** — one-click download of full video dataset
- **Responsive** — works on mobile

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15 (App Router) | API routes keep the YouTube key server-side |
| Styling | Tailwind CSS | Utility-first, fast to iterate |
| Charts | Recharts | Composable, React-native charting |
| Icons | Lucide React | Clean, consistent icon set |
| Deploy | Vercel | Zero-config Next.js deployment |
| Data | YouTube Data API v3 | Official, reliable, free tier sufficient |

---

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/vidmetrics.git
cd vidmetrics
```

### 2. Install dependencies
```bash
npm install
```

### 3. Get a YouTube API key

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. **APIs & Services → Library → YouTube Data API v3 → Enable**
4. **Credentials → Create Credentials → API Key**
5. Copy the key

### 4. Add your API key
```bash
cp .env.local.example .env.local
```

Open `.env.local` and replace the placeholder:
```
YOUTUBE_API_KEY=AIza...your_key_here
```

### 5. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel)

Connect your GitHub repo to [vercel.com](https://vercel.com) and add `YOUTUBE_API_KEY` in **Project Settings → Environment Variables**. Every `git push` auto-deploys.

---

## Project Structure
```
src/
├── app/
│   ├── api/channel/route.ts   # YouTube API proxy (server-side, key stays secret)
│   ├── globals.css            # Tailwind base + custom component classes
│   ├── layout.tsx             # Root layout + metadata
│   └── page.tsx               # Main dashboard page
├── components/
│   ├── ChannelInput.tsx       # URL input + search history + demo buttons
│   ├── ChannelHeader.tsx      # Channel avatar, name, subscriber count
│   ├── HealthScore.tsx        # 0-100 channel health score with breakdown
│   ├── TopPerformer.tsx       # Best video card pinned above table
│   ├── StatCards.tsx          # 4 KPI summary cards
│   ├── VelocityChart.tsx      # Recharts bar chart, trend-colored
│   └── VideoTable.tsx         # Sortable/filterable video table + export
└── lib/
    ├── youtube.ts             # YouTube API calls, types, enrichment logic
    └── utils.ts               # Number formatters, trend config
```

---

## How I Built This

**Approach:** Started from the core insight the client wanted — "which videos are crushing it." Defined "crushing it" as view velocity (views/day), not raw views, because a video with 500K views in 2 days beats one with 2M views over 6 months.

**AI-assisted workflow:**
- Used Claude to scaffold the full project structure and all component files
- Iterated on the design system — chose DM Mono + Fraunces for a "calm analyst" aesthetic
- API layer designed to keep the YouTube key server-side from day one (Next.js API route as proxy)
- All business logic (velocity calc, trend classification, health score) lives in lib files — testable and separate from UI

**Key decisions:**
- **Next.js over Vite** — API routes mean the key never hits the client bundle
- **View velocity as primary metric** — more signal than raw views for "this month" analysis
- **Health score** — single number summarising channel momentum, easy for clients to scan
- **Search history** — enterprise users re-check the same competitors repeatedly
- **CSV export** — enterprise clients want to put data in their own tools

---

---

## Build Approach & Notes

**Time taken:** ~3 hours from blank project to deployed app.

**Tools used:**
- Claude (Anthropic) — architecture decisions, all code generation, debugging
- Next.js 15 App Router — framework
- Vercel — deployment
- GitHub — version control with intentional commit history

**What I automated with AI:**
- Full project scaffold and file structure
- All component code — ChannelInput, StatCards, VelocityChart, VideoTable, HealthScore, TopPerformer
- YouTube API integration layer — channel resolution, video enrichment, velocity and engagement calculations
- Debugging build errors (ESLint conflicts, module resolution, ES module warnings)
- README and documentation

**What I made judgment calls on:**
- Defining "crushing it" as view velocity (views/day) not raw views — a 2-day-old video with 500K views beats a 30-day-old video with 2M
- Choosing Next.js over Vite specifically because the API key needed to stay server-side
- The "calm analyst" design direction — DM Mono + Fraunces, dark theme, single teal accent, no decoration
- Health score weightings — 40pts velocity, 35pts engagement, 25pts trending ratio
- Hiding columns on mobile rather than making the table horizontally scroll

**How I used AI to move fast:**
- Described the product goal first, let Claude propose the architecture
- Went file by file with clear commit boundaries so the history tells a story
- When errors hit (ESLint, missing deps, ES module warnings), pasted the exact error and fixed surgically — never started over
- Treated Claude as a senior dev pairing with me, not a code vending machine

**Tradeoffs made:**
- ESLint errors suppressed during build to ship faster — would clean up in v2
- Mock-friendly data layer — swapping in real API just required the key, no structural changes
- No caching — same channel re-fetches every time, fine for a demo, needs Redis in production

## What I'd Add in V2

- Cross-channel comparison (overlay 2 competitors on one chart)
- Sparkline per video showing velocity over time
- Shareable report URL (serialize state to query params)
- Caching layer to avoid re-fetching same channels repeatedly
- Webhook alerts when a competitor video crosses a velocity threshold
- Dark/light mode toggle

---

## API Quota

The YouTube Data API v3 free tier gives **10,000 units/day**. Each full channel analysis costs roughly 3–5 units. You won't hit the limit in normal use.
