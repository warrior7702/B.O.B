import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// AgentBus — local SQLite message bus on Dubya's PC
const AGENTBUS_URL = process.env.AGENTBUS_URL || 'http://100.90.196.118:4747';

async function busGet(path: string) {
  const res = await fetch(`${AGENTBUS_URL}${path}`, {
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-store' },
  });
  if (!res.ok) throw new Error(`AgentBus ${path} → ${res.status}`);
  return res.json();
}

export async function GET() {
  try {
    const [messages, presence] = await Promise.all([
      busGet('/messages?limit=100'),
      busGet('/presence'),
    ]);
    return NextResponse.json(
      { messages, presence },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: `AgentBus unavailable: ${msg}`, messages: [], presence: [] }, { status: 503 });
  }
}
