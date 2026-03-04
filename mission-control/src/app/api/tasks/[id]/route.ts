import { NextRequest, NextResponse } from 'next/server';

const AGENTBUS_URL = process.env.AGENTBUS_URL || 'http://100.90.196.118:4747';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const res = await fetch(`${AGENTBUS_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const res = await fetch(`${AGENTBUS_URL}/tasks/${id}`, { method: 'DELETE' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
