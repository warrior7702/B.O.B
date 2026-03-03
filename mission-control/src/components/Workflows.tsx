'use client';

import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { GitBranch, CheckCircle, XCircle, Clock, Loader2, PauseCircle } from 'lucide-react';

function timeAgo(ms: number) {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const STATUS_CONFIG = {
  pending:  { icon: <Clock className="w-4 h-4 text-slate-400" />,    badge: 'bg-slate-700 text-slate-300',        label: 'Pending' },
  running:  { icon: <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />, badge: 'bg-blue-500/20 text-blue-400', label: 'Running' },
  waiting:  { icon: <PauseCircle className="w-4 h-4 text-yellow-400" />, badge: 'bg-yellow-500/20 text-yellow-400', label: 'Waiting' },
  done:     { icon: <CheckCircle className="w-4 h-4 text-green-400" />, badge: 'bg-green-500/20 text-green-400',   label: 'Done' },
  failed:   { icon: <XCircle className="w-4 h-4 text-red-400" />,      badge: 'bg-red-500/20 text-red-400',       label: 'Failed' },
};

const STEP_STATUS_COLORS = {
  pending:  'bg-slate-600',
  running:  'bg-blue-400 animate-pulse',
  done:     'bg-green-400',
  failed:   'bg-red-400',
  skipped:  'bg-slate-700',
};

const AGENT_COLORS: Record<string, string> = {
  calvin: 'text-blue-400',
  doory: 'text-orange-400',
  bob: 'text-cyan-400',
  billy: 'text-yellow-400',
  dubya: 'text-purple-400',
  cornerstone: 'text-pink-400',
};

export function Workflows() {
  const active = useQuery(api.workflows.getActive) ?? [];
  const all = useQuery(api.workflows.getAll, { limit: 30 }) ?? [];
  const history = all.filter(w => w.status === 'done' || w.status === 'failed');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-cyan-400" />
          Workflows
        </h2>
        {active.length > 0 && (
          <span className="bg-blue-500/20 text-blue-400 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {active.length} active
          </span>
        )}
      </div>

      {/* Active */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Active</h3>
        {active.length === 0 ? (
          <div className="bg-slate-800/40 rounded-xl p-8 text-center text-slate-500">
            <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-30" />
            No active workflows.
          </div>
        ) : (
          <div className="space-y-3">
            {active.map(wf => {
              const cfg = STATUS_CONFIG[wf.status];
              return (
                <div key={wf._id} className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-slate-500">triggered by {wf.triggeredBy}</span>
                        <span className="text-xs text-slate-600">·</span>
                        <span className="text-xs text-slate-500" suppressHydrationWarning>{timeAgo(wf.createdAt)}</span>
                      </div>
                      <p className="font-semibold text-white">{wf.name}</p>
                      <p className="text-sm text-slate-400 mt-0.5">{wf.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Step pipeline */}
                  <div className="flex items-center gap-2">
                    {wf.steps.map((step, i) => (
                      <div key={step.id} className="flex items-center gap-2">
                        <div className="flex flex-col items-center gap-1">
                          <div className={`w-3 h-3 rounded-full ${STEP_STATUS_COLORS[step.status]}`} title={`${step.id}: ${step.status}`} />
                          <span className={`text-xs ${AGENT_COLORS[step.agent] ?? 'text-slate-400'}`}>{step.agent}</span>
                          <span className="text-xs text-slate-600 text-center max-w-16 truncate">{step.action.replace(/_/g,' ')}</span>
                        </div>
                        {i < wf.steps.length - 1 && (
                          <div className="w-6 h-px bg-slate-700 mb-5" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">History</h3>
          <div className="space-y-2">
            {history.map(wf => {
              const cfg = STATUS_CONFIG[wf.status];
              return (
                <div key={wf._id} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex items-center gap-4">
                  {cfg.icon}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-300 truncate">{wf.name}</p>
                    <p className="text-xs text-slate-500">{wf.triggeredBy} · {timeAgo(wf.createdAt)}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {wf.steps.map(s => (
                      <div key={s.id} className={`w-2 h-2 rounded-full ${STEP_STATUS_COLORS[s.status]}`} title={s.id} />
                    ))}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
