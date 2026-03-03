import { exec } from 'child_process';
import { promisify } from 'util';
import { NextResponse } from 'next/server';

const execAsync = promisify(exec);

async function getCPU(): Promise<number> {
  try {
    const { stdout } = await execAsync("top -l 1 -n 0 | grep 'CPU usage' | awk '{print $3}' | tr -d '%'");
    return Math.round(parseFloat(stdout.trim())) || 0;
  } catch {
    return 0;
  }
}

async function getMemory(): Promise<number> {
  try {
    const { stdout } = await execAsync("vm_stat | awk '/Pages active/ {active=$3} /Pages wired/ {wired=$4} /Pages free/ {free=$3} /Pages speculative/ {spec=$3} END {total=active+wired+free+spec; used=active+wired; printf \"%.0f\", used/total*100}'");
    return Math.round(parseFloat(stdout.trim())) || 0;
  } catch {
    return 0;
  }
}

async function getDisk(): Promise<number> {
  try {
    const { stdout } = await execAsync("df -h / | tail -1 | awk '{print $5}' | tr -d '%'");
    return parseInt(stdout.trim()) || 0;
  } catch {
    return 0;
  }
}

async function getOllamaStatus(): Promise<'running' | 'stopped' | 'error'> {
  try {
    const { stdout } = await execAsync("curl -s -m 2 http://localhost:11434/api/tags");
    return stdout.includes('models') ? 'running' : 'stopped';
  } catch {
    return 'stopped';
  }
}

export async function GET() {
  const [cpu, memory, disk, ollama] = await Promise.all([
    getCPU(),
    getMemory(),
    getDisk(),
    getOllamaStatus(),
  ]);

  return NextResponse.json({
    cpu,
    memory,
    disk,
    network: 'connected',
    ollama,
    agents: [
      {
        id: 'bob',
        name: 'B.O.B.',
        emoji: '🦦',
        status: 'online',
        model: 'anthropic/claude-sonnet-4-6',
        lastSeen: 'Just now',
        currentTask: 'Active',
        location: 'Camp MacBook Pro (Intel)',
      },
      {
        id: 'cornerstone',
        name: 'Cornerstone',
        emoji: '🪨',
        status: 'online',
        model: 'anthropic/claude-sonnet-4-6',
        lastSeen: 'Just now',
        currentTask: 'Awaiting tasks',
        location: 'FBCA Office (M1)',
      },
      {
        id: 'dubya',
        name: 'Dubya',
        emoji: '🦡',
        status: 'online',
        model: 'openrouter/deepseek/deepseek-r1',
        lastSeen: 'Just now',
        currentTask: 'Standing by',
        location: 'FBCA Office (Windows PC)',
      },
    ],
  });
}
