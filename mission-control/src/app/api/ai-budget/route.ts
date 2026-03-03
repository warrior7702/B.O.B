import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BUDGET_FILE = path.join(process.env.HOME || '', '.openclaw', 'workspace', 'ai-budget.json');

const DEFAULT = {
  balance: 211.83,
  lowAlertThreshold: 50,
  updatedAt: new Date().toISOString(),
  updatedBy: 'billy',
};

function read() {
  try {
    return JSON.parse(fs.readFileSync(BUDGET_FILE, 'utf8'));
  } catch {
    return DEFAULT;
  }
}

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req: Request) {
  const body = await req.json();
  const current = read();
  const updated = {
    ...current,
    balance: typeof body.balance === 'number' ? body.balance : current.balance,
    lowAlertThreshold: typeof body.lowAlertThreshold === 'number' ? body.lowAlertThreshold : current.lowAlertThreshold,
    updatedAt: new Date().toISOString(),
    updatedBy: body.updatedBy ?? 'billy',
  };
  fs.writeFileSync(BUDGET_FILE, JSON.stringify(updated, null, 2));
  return NextResponse.json(updated);
}
