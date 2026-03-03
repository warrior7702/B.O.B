'use client';

import { useState, useEffect, useRef } from 'react';
import { Radio, RefreshCw, Circle } from 'lucide-react';

const AGENT_CONFIG: Record<string, { emoji: string; color: string; bg: string }> = {
  bob:         { emoji: '🦦', color: 'text-cyan-400',   bg: 'bg-cyan-500/10 border-cyan-500/20' },
  cornerstone: { emoji: '🪨', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  dubya:       { emoji: '🦡', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  billy:       { emoji: '👤', color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/20' },
};

function getAgent(id: string) {
  return AGENT_CONFIG[id.toLowerCase()] ?? { emoji: '🤖', color: 'text-slate-400', bg: 'bg-slate-700/50 border-slate-600' };
}

function timeAgo(ms: number) {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function presenceColor(lastSeen: number, status: string) {
  if (status === 'offline') return 'bg-slate-500';
  const mins = (Date.now() - lastSeen) / 60000;
  if (mins < 5) return 'bg-green-400';
  if (mins < 30) return 'bg-yellow-400';
  return 'bg-red-400';
}

function presenceLabel(lastSeen: number, status: string) {
  if (status === 'offline') return 'Offline';
  const mins = (Date.now() - lastSeen) / 60000;
  if (mins < 5) return 'Online';
  if (mins < 30) return `${Math.floor(mins)}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

type MsgType = 'chat' | 'request' | 'response' | 'heartbeat';

interface Message {
  _id: string;
  _creationTime: number;
  fromAgent: string;
  toAgent: string;
  messageType: MsgType;
  content: string;
  read: boolean;
  priority?: number;
  contextId?: string;
}

interface Presence {
  agentId: string;
  status: string;
  lastSeen: number;
  capabilities?: string[];
  currentTask?: string;
}

const TYPE_BADGE: Record<MsgType, string> = {
  chat:      'bg-slate-700 text-slate-300',
  request:   'bg-blue-500/20 text-blue-400',
  response:  'bg-green-500/20 text-green-400',
  heartbeat: 'bg-slate-800 text-slate-500',
};

export function AgentComms() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [presence, setPresence] = useState<Presence[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [hideHeartbeats, setHideHeartbeats] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agent-messages');
      const data = await res.json();
      setMessages((data.messages ?? []).reverse()); // oldest first for thread view
      setPresence(data.presence ?? []);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const agents = ['all', 'bob', 'cornerstone', 'dubya'];
  const filtered = messages.filter(m => {
    if (hideHeartbeats && m.messageType === 'heartbeat') return false;
    if (filter === 'all') return true;
    return m.fromAgent === filter || m.toAgent === filter;
  });

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Radio className="w-6 h-6 text-cyan-400" />
          Agent Comms
        </h2>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-sm text-slate-400" suppressHydrationWarning>
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button onClick={fetchData} className="p-2 text-slate-400 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Presence Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['bob', 'cornerstone', 'dubya'].map(agentId => {
          const p = presence.find(pr => pr.agentId === agentId);
          const cfg = getAgent(agentId);
          const dot = p ? presenceColor(p.lastSeen, p.status) : 'bg-slate-600';
          const label = p ? presenceLabel(p.lastSeen, p.status) : 'Never seen';
          const unread = messages.filter(m => m.toAgent === agentId && !m.read).length;
          return (
            <div key={agentId} className={`rounded-xl p-3 border ${cfg.bg} flex items-center gap-3`}>
              <span className="text-2xl">{cfg.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Circle className={`w-2 h-2 fill-current ${dot.replace('bg-', 'text-')}`} />
                  <p className={`text-sm font-semibold capitalize ${cfg.color}`}>{agentId}</p>
                  {unread > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {unread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500" suppressHydrationWarning>{label}</p>
                {p?.currentTask && <p className="text-xs text-slate-600 truncate">{p.currentTask}</p>}
              </div>
            </div>
          );
        })}
        {/* Billy */}
        <div className={`rounded-xl p-3 border ${getAgent('billy').bg} flex items-center gap-3`}>
          <span className="text-2xl">👤</span>
          <div>
            <div className="flex items-center gap-1.5">
              <Circle className="w-2 h-2 fill-current text-green-400" />
              <p className="text-sm font-semibold text-green-400">Billy</p>
            </div>
            <p className="text-xs text-slate-500">Human authority</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1">
          {agents.map(a => (
            <button
              key={a}
              onClick={() => setFilter(a)}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                filter === a ? 'bg-cyan-500/30 text-cyan-400 border border-cyan-500/40' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {a === 'all' ? 'All' : getAgent(a).emoji + ' ' + a}
            </button>
          ))}
        </div>
        <button
          onClick={() => setHideHeartbeats(h => !h)}
          className={`px-3 py-1 rounded-full text-xs transition-colors ${
            hideHeartbeats ? 'bg-slate-800 text-slate-500' : 'bg-yellow-500/20 text-yellow-400'
          }`}
        >
          {hideHeartbeats ? '❤️ heartbeats hidden' : '❤️ show heartbeats'}
        </button>
        <span className="text-xs text-slate-600">{filtered.length} messages</span>
      </div>

      {/* Message Thread */}
      <div className="flex-1 bg-slate-900/50 rounded-xl border border-slate-700 overflow-y-auto max-h-[500px] p-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-500">
            <Radio className="w-8 h-8 mb-2 opacity-30" />
            <p>No messages yet.</p>
          </div>
        ) : (
          filtered.map(msg => {
            const from = getAgent(msg.fromAgent);
            const to = getAgent(msg.toAgent);
            return (
              <div key={msg._id} className={`rounded-xl p-3 border ${from.bg}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-base">{from.emoji}</span>
                  <span className={`text-xs font-semibold capitalize ${from.color}`}>{msg.fromAgent}</span>
                  <span className="text-slate-600 text-xs">→</span>
                  <span className="text-base">{to.emoji}</span>
                  <span className={`text-xs font-semibold capitalize ${to.color}`}>{msg.toAgent}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ml-auto ${TYPE_BADGE[msg.messageType]}`}>
                    {msg.messageType}
                  </span>
                  {!msg.read && <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" title="Unread" />}
                  <span className="text-xs text-slate-600 shrink-0" suppressHydrationWarning>
                    {timeAgo(msg._creationTime)}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{msg.content}</p>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
