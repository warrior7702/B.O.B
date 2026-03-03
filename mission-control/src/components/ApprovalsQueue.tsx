'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { CheckCircle, XCircle, Clock, Bot, AlertCircle, CheckCheck } from 'lucide-react';

const AGENT_COLORS: Record<string, string> = {
  bob: 'bg-cyan-500/20 text-cyan-400',
  calvin: 'bg-blue-500/20 text-blue-400',
  doory: 'bg-orange-500/20 text-orange-400',
  cornerstone: 'bg-purple-500/20 text-purple-400',
  compass: 'bg-green-500/20 text-green-400',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-slate-400',
  medium: 'text-yellow-400',
  high: 'text-orange-400',
  urgent: 'text-red-400',
};

const STATUS_ICONS: Record<string, JSX.Element> = {
  pending: <Clock className="w-4 h-4 text-yellow-400" />,
  approved: <CheckCircle className="w-4 h-4 text-green-400" />,
  denied: <XCircle className="w-4 h-4 text-red-400" />,
  executed: <CheckCheck className="w-4 h-4 text-cyan-400" />,
  expired: <AlertCircle className="w-4 h-4 text-slate-500" />,
};

function timeAgo(ms: number) {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function ApprovalsQueue() {
  const pending = useQuery(api.approvals.getPending) ?? [];
  const all = useQuery(api.approvals.getAll, { limit: 30 }) ?? [];
  const approve = useMutation(api.approvals.approve);
  const deny = useMutation(api.approvals.deny);

  const history = all.filter(a => a.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Bot className="w-6 h-6 text-yellow-400" />
          Approvals
        </h2>
        {pending.length > 0 && (
          <span className="bg-yellow-500/20 text-yellow-400 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {pending.length} pending
          </span>
        )}
      </div>

      {/* Pending Queue */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Needs Your Attention</h3>
        {pending.length === 0 ? (
          <div className="bg-slate-800/40 rounded-xl p-8 text-center text-slate-500">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500/40" />
            All clear — no pending approvals.
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(action => (
              <div key={action._id} className="bg-slate-800/60 border border-yellow-500/20 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${AGENT_COLORS[action.agent] ?? 'bg-slate-700 text-slate-300'}`}>
                        {action.agent.toUpperCase()}
                      </span>
                      <span className={`text-xs font-medium ${PRIORITY_COLORS[action.priority]}`}>
                        {action.priority.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-500">{timeAgo(action.createdAt)}</span>
                    </div>
                    <p className="font-semibold text-white">{action.title}</p>
                    <p className="text-sm text-slate-400 mt-1">{action.description}</p>
                    {action.actionType && (
                      <p className="text-xs text-slate-600 mt-2">Type: {action.actionType}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => approve({ id: action._id as Id<'pendingActions'> })}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => deny({ id: action._id as Id<'pendingActions'> })}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Deny
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">History</h3>
          <div className="space-y-2">
            {history.map(action => (
              <div key={action._id} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 flex items-center gap-4">
                {STATUS_ICONS[action.status]}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-300 truncate">{action.title}</p>
                  <p className="text-xs text-slate-500">{action.agent.toUpperCase()} · {timeAgo(action.createdAt)}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                  action.status === 'approved' || action.status === 'executed' ? 'bg-green-500/10 text-green-400' :
                  action.status === 'denied' ? 'bg-red-500/10 text-red-400' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {action.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
