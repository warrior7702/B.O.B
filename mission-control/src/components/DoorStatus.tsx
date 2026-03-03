'use client';

import { useState, useEffect } from 'react';
import { DoorOpen, DoorClosed, Activity, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const MAPPED_IDS = new Set([1, 27, 71, 86, 87, 193, 224, 225, 240, 241, 280, 281]);

interface Door {
  doorID: number;
  doorName: string;
  controllerName: string;
  isActive: boolean;
  lastSyncTime: string;
}

interface Health {
  status: string;
  uptime: string;
  version: string;
  checks: Record<string, string>;
}

export function DoorStatus() {
  const [doors, setDoors] = useState<Door[]>([]);
  const [health, setHealth] = useState<Health | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const [doorsRes, healthRes] = await Promise.all([
        fetch('/api/doors'),
        fetch('/api/door-health'),
      ]);
      const doorsData = await doorsRes.json();
      const healthData = await healthRes.json();
      setDoors((doorsData.doors || []).filter((d: Door) => MAPPED_IDS.has(d.doorID)));
      setHealth(healthData);
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError('Could not reach Door Control system');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const allOnline = doors.every(d => d.isActive);
  const offlineDoors = doors.filter(d => !d.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <DoorOpen className="w-6 h-6 text-cyan-400" />
          DOORY — Door Status
        </h2>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-sm text-slate-400" suppressHydrationWarning>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button onClick={fetchStatus} className="p-2 text-slate-400 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* System Health */}
      {health && (
        <div className={`rounded-xl p-5 border ${health.status === 'Healthy' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/30'}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4" />
              System Health
            </h3>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${health.status === 'Healthy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {health.status}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(health.checks ?? {}).map(([key, val]) => (
              <div key={key} className="bg-slate-900/40 rounded-lg p-3">
                <p className="text-xs text-slate-400 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                <div className="flex items-center gap-1">
                  {val === 'Healthy' || val === 'Running'
                    ? <CheckCircle className="w-3 h-3 text-green-400" />
                    : <AlertCircle className="w-3 h-3 text-red-400" />}
                  <span className={`text-sm font-medium ${val === 'Healthy' || val === 'Running' ? 'text-green-400' : 'text-red-400'}`}>{val}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">Uptime: {health.uptime} · v{health.version}</p>
        </div>
      )}

      {/* Alert Banner */}
      {offlineDoors.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span className="text-red-400 font-medium">{offlineDoors.length} door{offlineDoors.length > 1 ? 's' : ''} offline: {offlineDoors.map(d => d.doorName).join(', ')}</span>
        </div>
      )}

      {/* Door Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {doors.map(door => (
          <div
            key={door.doorID}
            className={`rounded-xl p-4 border ${door.isActive
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-red-500/10 border-red-500/30'}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium text-white text-sm">{door.doorName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{door.controllerName}</p>
              </div>
              <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${door.isActive
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'}`}>
                {door.isActive
                  ? <><CheckCircle className="w-3 h-3" /> Online</>
                  : <><AlertCircle className="w-3 h-3" /> Offline</>}
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-2">ID: {door.doorID}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
