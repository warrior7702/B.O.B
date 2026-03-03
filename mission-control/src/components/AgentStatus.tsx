import { useEffect, useState } from 'react';
import { Activity, AlertCircle, CheckCircle, Clock, Cpu, HardDrive, Network, Server, Zap, ExternalLink } from 'lucide-react';

interface AgentStatus {
  id: string;
  name: string;
  emoji: string;
  status: 'online' | 'offline' | 'busy' | 'error';
  model: string;
  lastSeen: string;
  currentTask?: string;
  location: string;
}

interface SystemHealth {
  cpu: number;
  memory: number;
  disk: number;
  network: 'connected' | 'disconnected';
  ollama: 'running' | 'stopped' | 'error';
}

interface AIUsage {
  rateLimit: {
    requestsLimit: number;
    requestsRemaining: number;
    tokensLimit: number;
    tokensRemaining: number;
    inputTokensLimit: number;
    inputTokensRemaining: number;
    outputTokensLimit: number;
    outputTokensRemaining: number;
    requestsReset: string;
  };
  consoleUrl: string;
  checkedAt: string;
}

interface AIBudget {
  balance: number;
  lowAlertThreshold: number;
  updatedAt: string;
  updatedBy: string;
}

export function AgentStatusPanel() {
  const [agents, setAgents] = useState<AgentStatus[]>([
    {
      id: 'bob',
      name: 'B.O.B.',
      emoji: '🦦',
      status: 'online',
      model: 'ollama/llama3.1',
      lastSeen: 'Just now',
      currentTask: 'Building Visibility Dashboard',
      location: 'Camp MacBook Pro (Intel)'
    },
    {
      id: 'cornerstone',
      name: 'Cornerstone',
      emoji: '🪨',
      status: 'online',
      model: 'openrouter/moonshotai/kimi-k2.5',
      lastSeen: 'Just now',
      currentTask: 'Awaiting tasks',
      location: 'FBCA Office (M1)'
    },
    {
      id: 'dubya',
      name: 'Dubya',
      emoji: '🦡',
      status: 'online',
      model: 'openrouter/deepseek/deepseek-r1',
      lastSeen: 'Just now',
      currentTask: 'Standing by',
      location: 'FBCA Office (Windows PC)'
    }
  ]);

  const [aiUsage, setAIUsage] = useState<AIUsage | null>(null);
  const [aiBudget, setAIBudget] = useState<AIBudget | null>(null);
  const [editingBalance, setEditingBalance] = useState(false);
  const [newBalance, setNewBalance] = useState('');

  const [health, setHealth] = useState<SystemHealth>({
    cpu: 45,
    memory: 62,
    disk: 23,
    network: 'connected',
    ollama: 'running'
  });

  // Fetch real status every 30 seconds
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        setHealth({
          cpu: data.cpu,
          memory: data.memory,
          disk: data.disk,
          network: data.network,
          ollama: data.ollama,
        });
        setAgents(data.agents);
      } catch {
        // keep last known state on error
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fetch AI usage every 5 minutes
  useEffect(() => {
    const checkAI = async () => {
      try {
        const res = await fetch('/api/ai-usage');
        if (res.ok) setAIUsage(await res.json());
      } catch {}
    };
    checkAI();
    const interval = setInterval(checkAI, 300000);
    return () => clearInterval(interval);
  }, []);

  // Fetch AI budget
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const res = await fetch('/api/ai-budget');
        if (res.ok) setAIBudget(await res.json());
      } catch {}
    };
    fetchBudget();
  }, []);

  const saveBalance = async () => {
    const val = parseFloat(newBalance);
    if (isNaN(val)) return;
    const res = await fetch('/api/ai-budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ balance: val }),
    });
    if (res.ok) { setAIBudget(await res.json()); setEditingBalance(false); setNewBalance(''); }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" />
          Agent Status
        </h2>
        <span className="text-sm text-slate-400" suppressHydrationWarning>
          Last updated: {new Date().toLocaleTimeString()}
        </span>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-cyan-500/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{agent.emoji}</span>
                <div>
                  <h3 className="font-semibold text-white text-lg">{agent.name}</h3>
                  <p className="text-sm text-slate-400">{agent.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)} animate-pulse`}></span>
                <span className="text-sm text-slate-300 capitalize">{agent.status}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Model:</span>
                <span className="text-cyan-400 font-mono">{agent.model}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Current Task:</span>
                <span className="text-white">{agent.currentTask || 'Idle'}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Last Seen:</span>
                <span className="text-green-400 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  {agent.lastSeen}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Health */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-cyan-400" />
          System Health
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* CPU */}
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">CPU</span>
            </div>
            <div className="text-2xl font-bold text-white">{health.cpu}%</div>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${health.cpu > 80 ? 'bg-red-500' : health.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${health.cpu}%` }}
              ></div>
            </div>
          </div>

          {/* Memory */}
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Memory</span>
            </div>
            <div className="text-2xl font-bold text-white">{health.memory}%</div>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${health.memory > 80 ? 'bg-red-500' : health.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${health.memory}%` }}
              ></div>
            </div>
          </div>

          {/* Disk */}
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Disk</span>
            </div>
            <div className="text-2xl font-bold text-white">{health.disk}%</div>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
              <div 
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${health.disk}%` }}
              ></div>
            </div>
          </div>

          {/* Network */}
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Network className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Network</span>
            </div>
            <div className={`text-lg font-bold flex items-center gap-2 ${health.network === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
              {health.network === 'connected' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {health.network === 'connected' ? 'Online' : 'Offline'}
            </div>
            <p className="text-xs text-slate-500 mt-1">Tailscale active</p>
          </div>
        </div>
      </div>

      {/* AI Budget + Usage */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Anthropic — Credits & Rate Limits
          </h3>
          <a href="https://console.anthropic.com/settings/billing" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
            Console <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Credit Balance */}
          <div className={`rounded-lg p-4 border ${aiBudget && aiBudget.balance < aiBudget.lowAlertThreshold ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-900/50 border-slate-700'}`}>
            <p className="text-xs text-slate-400 mb-1">Credit Balance</p>
            {editingBalance ? (
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  value={newBalance}
                  onChange={e => setNewBalance(e.target.value)}
                  placeholder="0.00"
                  className="w-20 bg-slate-700 text-white text-sm rounded px-2 py-1 border border-slate-600"
                  autoFocus
                />
                <button onClick={saveBalance} className="text-xs text-green-400 hover:text-green-300">Save</button>
                <button onClick={() => setEditingBalance(false)} className="text-xs text-slate-500 hover:text-slate-400">Cancel</button>
              </div>
            ) : (
              <div className="flex items-end gap-2">
                <p className={`text-2xl font-bold ${aiBudget && aiBudget.balance < 50 ? 'text-red-400' : aiBudget && aiBudget.balance < 100 ? 'text-yellow-400' : 'text-green-400'}`}>
                  ${aiBudget?.balance.toFixed(2) ?? '—'}
                </p>
                <button onClick={() => { setEditingBalance(true); setNewBalance(aiBudget?.balance.toFixed(2) ?? ''); }}
                  className="text-xs text-slate-500 hover:text-slate-400 mb-1">edit</button>
              </div>
            )}
            {aiBudget && (
              <p className="text-xs text-slate-600 mt-1" suppressHydrationWarning>
                Updated {new Date(aiBudget.updatedAt).toLocaleDateString()}
              </p>
            )}
            {aiBudget && aiBudget.balance < aiBudget.lowAlertThreshold && (
              <p className="text-xs text-red-400 mt-1">⚠️ Low balance</p>
            )}
          </div>

          {/* Requests */}
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">Requests / min</p>
            <p className="text-xl font-bold text-white">
              {aiUsage ? aiUsage.rateLimit.requestsRemaining.toLocaleString() : '—'}
              <span className="text-sm text-slate-500"> / {aiUsage ? aiUsage.rateLimit.requestsLimit.toLocaleString() : '—'}</span>
            </p>
            {aiUsage && <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
              <div className="h-1.5 rounded-full bg-cyan-500"
                style={{ width: `${(aiUsage.rateLimit.requestsRemaining / aiUsage.rateLimit.requestsLimit) * 100}%` }} />
            </div>}
          </div>

          {/* Input tokens */}
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">Input Tokens / min</p>
            <p className="text-xl font-bold text-white">
              {aiUsage ? `${(aiUsage.rateLimit.inputTokensRemaining / 1000).toFixed(0)}k` : '—'}
              <span className="text-sm text-slate-500"> / {aiUsage ? `${(aiUsage.rateLimit.inputTokensLimit / 1000000).toFixed(1)}M` : '—'}</span>
            </p>
            {aiUsage && <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
              <div className="h-1.5 rounded-full bg-green-500"
                style={{ width: `${(aiUsage.rateLimit.inputTokensRemaining / aiUsage.rateLimit.inputTokensLimit) * 100}%` }} />
            </div>}
          </div>

          {/* Output tokens */}
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">Output Tokens / min</p>
            <p className="text-xl font-bold text-white">
              {aiUsage ? `${(aiUsage.rateLimit.outputTokensRemaining / 1000).toFixed(0)}k` : '—'}
              <span className="text-sm text-slate-500"> / {aiUsage ? `${(aiUsage.rateLimit.outputTokensLimit / 1000).toFixed(0)}k` : '—'}</span>
            </p>
            {aiUsage && <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
              <div className="h-1.5 rounded-full bg-purple-500"
                style={{ width: `${(aiUsage.rateLimit.outputTokensRemaining / aiUsage.rateLimit.outputTokensLimit) * 100}%` }} />
            </div>}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
        <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors border border-cyan-500/30">
            Refresh Status
          </button>
          <button className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">
            View Logs
          </button>
          <button className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">
            Restart Agents
          </button>
          <button className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors border border-green-500/30">
            Generate Daily Brief
          </button>
        </div>
      </div>
    </div>
  );
}
