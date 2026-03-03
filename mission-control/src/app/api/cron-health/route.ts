import { NextResponse } from 'next/server';

const CRON_JOBS = [
  { id: '06edd102-632d-46d2-aa12-40f3d73dbb23', name: 'Daily Brief' },
  { id: '3c034eb2-8c6b-4c7f-8a96-d43de0945e0d', name: 'SSH Monitor' },
  { id: 'aeb59832-b130-4c75-9fac-b5c5f0f4f788', name: 'Disk Monitor' },
  { id: 'c5931d13-f61e-4cd1-8b81-c7977142e5b3', name: 'Config Audit' },
  { id: 'e9ca3f39-16a9-4e8e-bcca-a5707fb0eaa2', name: 'Memory Log' },
  { id: 'dac6c5cf-dcbd-452d-96d9-de2043fe6008', name: 'Learning Extractor' },
  { id: 'b3d383bf-6ac6-4c39-8fa7-84363a6b14a5', name: 'COMPASS' },
  { id: 'bf9821ce-0e7c-4eac-a564-e6feb74973ec', name: 'Sunday Attendance' },
  { id: 'c3c15892-5cc0-49be-96e4-c8a7a29c4978', name: 'CALVIN' },
  { id: '6cbe0c05-af3c-49fb-9c51-ff770ac0fc14', name: 'DOORY' },
  { id: 'd4822edf-7608-4069-a384-52955b3c0433', name: 'Cron Health Monitor' },
];

export async function GET() {
  const gatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN;
  const results = await Promise.all(
    CRON_JOBS.map(async (job) => {
      try {
        const res = await fetch(`http://localhost:18789/api/cron/runs/${job.id}`, {
          headers: gatewayToken ? { Authorization: `Bearer ${gatewayToken}` } : {},
          cache: 'no-store',
        });
        if (!res.ok) return { ...job, runs: [], health: 'unknown' };
        const data = await res.json();
        const runs: { status: string; ts: number; error?: string }[] = (data.entries ?? []).slice(0, 3);
        const allError = runs.length >= 3 && runs.every(r => r.status === 'error');
        const lastRun = runs[0] ?? null;
        return {
          ...job,
          runs,
          health: allError ? 'failing' : lastRun?.status === 'error' ? 'warn' : 'ok',
          lastStatus: lastRun?.status ?? 'never',
          lastRan: lastRun?.ts ?? null,
          lastError: lastRun?.error ?? null,
        };
      } catch {
        return { ...job, runs: [], health: 'unknown', lastStatus: 'unknown', lastRan: null, lastError: null };
      }
    })
  );
  return NextResponse.json({ jobs: results });
}
