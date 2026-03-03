'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertTriangle, XCircle, RefreshCw, Activity } from 'lucide-react';

interface CronJob {
  id: string;
  name: string;
  health: 'ok' | 'warn' | 'failing' | 'unknown';
  lastStatus: string;
  lastRan: number | null;
  lastError: string | null;
  runs: { status: string; ts: number; error?: string }[];
}

function timeAgo(ms: number) {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const HEALTH_CONFIG = {
  ok:      { icon: <CheckCircle className="w-4 h-4 text-green-400" />,   badge: 'bg-green-500/20 text-green-400',   label: 'OK' },
  warn:    { icon: <AlertTriangle className="w-4 h-4 text-yellow-400" />, badge: 'bg-yellow-500/20 text-yellow-400', label: 'Warn' },
  failing: { icon: <XCircle className="w-4 h-4 text-red-400" />,         badge: 'bg-red-500/20 text-red-400',       label: 'Failing' },
  unknown: { icon: <Clock className="w-4 h-4 text-slate-500" />,         badge: 'bg-slate-700 text-slate-400',      label: 'Unknown' },
};

export function CronHealth() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cron-health');
      const data = await res.json();
      setJobs(data.jobs ?? []);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 120000);
    return () => clearInterval(interval);
  }, []);

  const failing = jobs.filter(j => j.health === 'failing');
  const warn = jobs.filter(j => j.health === 'warn');
  const ok = jobs.filter(j => j.health === 'ok');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" />
          Cron Health
        </h2>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-sm text-slate-400" suppressHydrationWarning>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button onClick={fetchHealth} className="p-2 text-slate-400 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Healthy', count: ok.length, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
          { label: 'Warnings', count: warn.length, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
          { label: 'Failing', count: failing.length, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 border ${s.bg} text-center`}>
            <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-sm text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Alert Banner */}
      {failing.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span className="text-red-400 font-medium">
            {failing.length} job{failing.length > 1 ? 's' : ''} failing: {failing.map(j => j.name).join(', ')}
          </span>
        </div>
      )}

      {/* Job List */}
      <div className="space-y-2">
        {jobs.map(job => {
          const cfg = HEALTH_CONFIG[job.health];
          return (
            <div
              key={job.id}
              className={`rounded-xl p-4 border flex items-center gap-4 ${
                job.health === 'failing' ? 'bg-red-500/5 border-red-500/20' :
                job.health === 'warn' ? 'bg-yellow-500/5 border-yellow-500/10' :
                'bg-slate-800/40 border-slate-700/50'
              }`}
            >
              {cfg.icon}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm">{job.name}</p>
                {job.lastError && job.health !== 'ok' && (
                  <p className="text-xs text-slate-500 truncate mt-0.5">{job.lastError}</p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {/* Last 3 run dots */}
                <div className="flex gap-1">
                  {job.runs.slice(0, 3).map((r, i) => (
                    <div
                      key={i}
                      title={`${r.status}${r.error ? ': ' + r.error : ''}`}
                      className={`w-2 h-2 rounded-full ${r.status === 'error' ? 'bg-red-400' : 'bg-green-400'}`}
                    />
                  ))}
                </div>
                {job.lastRan && (
                  <span className="text-xs text-slate-500" suppressHydrationWarning>{timeAgo(job.lastRan)}</span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
                  {cfg.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
