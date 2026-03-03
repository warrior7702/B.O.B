import { NextResponse } from 'next/server';
import https from 'https';

export async function GET() {
  try {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const res = await fetch('https://100.123.239.124:5003/api/health', {
      // @ts-ignore
      agent,
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ status: 'Unreachable', error: 'Door Control offline' }, { status: 503 });
  }
}
