# B.O.B. Mission Control

A NextJS + Convex dashboard for managing B.O.B. (Bot On Board) and FBCA operations.

## Features

- **Task Board** — Kanban board tracking tasks between Billy and B.O.B.
- **Content Pipeline** — Video/script workflow from idea to published
- **Calendar** — Scheduled tasks and cron job monitoring
- **Memory Viewer** — Searchable memory database
- **Team** — Digital organization structure
- **Office** — Visual workspace status

## Tech Stack

- NextJS 14 (App Router)
- React 18
- TypeScript
- TailwindCSS
- Convex (database)
- Lucide React (icons)

## Setup

### 1. Install Dependencies

```bash
cd mission-control
npm install
```

### 2. Set Up Convex

```bash
npx convex dev
```

This will:
- Create a Convex project
- Start the local dev server
- Generate the convex/_generated directory

### 3. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_CONVEX_URL=https://your-convex-url.convex.cloud
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Deployment

### Convex Production

```bash
npx convex deploy
```

### Vercel

```bash
npm i -g vercel
vercel --prod
```

## Architecture

```
mission-control/
├── convex/           # Database schema and functions
├── src/
│   ├── app/         # NextJS app router
│   ├── components/  # React components
│   ├── types/       # TypeScript types
│   └── lib/         # Utilities
├── README.md
└── package.json
```

## Next Steps

1. Connect to real data sources:
   - Read actual memory files from `~/.openclaw/workspace/memory/`
   - Query real cron jobs
   - Integrate with OpenClaw API

2. Add authentication:
   - Clerk or NextAuth for secure access

3. Real-time updates:
   - Convex subscriptions for live task updates

4. Mobile responsive:
   - Optimize for phone/tablet viewing

## Created By

B.O.B. (Bot On Board) for First Baptist Church Arlington