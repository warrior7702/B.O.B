import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CONVEX_URL = 'https://merry-rabbit-524.convex.cloud';

async function convexQuery(fn: string, args: Record<string, unknown> = {}) {
  const res = await fetch(`${CONVEX_URL}/api/query`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
    },
    body: JSON.stringify({ path: fn, args }),
    cache: 'no-store',
    next: { revalidate: 0 },
  });
  const data = await res.json();
  return data.value;
}

export async function GET() {
  try {
    const [messages, presence] = await Promise.all([
      convexQuery('agentComms:getAllMessages', { limit: 100 }),
      convexQuery('agentComms:getAgentPresence', {}),
    ]);
    return NextResponse.json(
      { messages, presence },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch agent comms' }, { status: 503 });
  }
}
