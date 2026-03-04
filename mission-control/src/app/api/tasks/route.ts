import { NextRequest, NextResponse } from 'next/server';

const AGENTBUS_URL = process.env.AGENTBUS_URL || 'http://100.90.196.118:4747';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const assignee = searchParams.get('assignee');
  const status = searchParams.get('status');

  const params = new URLSearchParams();
  if (assignee) params.set('assignee', assignee);
  if (status) params.set('status', status);

  try {
    const res = await fetch(`${AGENTBUS_URL}/tasks?${params}`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = await fetch(`${AGENTBUS_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
