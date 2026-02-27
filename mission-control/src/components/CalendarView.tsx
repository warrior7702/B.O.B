'use client';

import { useState } from 'react';
import { ScheduledTask } from '@/types';
import { Calendar as CalendarIcon, Clock, CheckCircle, AlertCircle, PauseCircle } from 'lucide-react';

const mockScheduledTasks: ScheduledTask[] = [
  {
    _id: '1',
    title: 'SSH Brute Force Monitor',
    description: 'Check for failed SSH login attempts',
    cronExpression: '*/10 * * * *',
    nextRun: Date.now() + 600000,
    lastRun: Date.now() - 300000,
    status: 'active',
    type: 'monitor',
  },
  {
    _id: '2',
    title: 'Disk Space Check',
    description: 'Monitor disk usage and alert if >90%',
    cronExpression: '0 * * * *',
    nextRun: Date.now() + 3600000,
    lastRun: Date.now() - 1800000,
    status: 'active',
    type: 'monitor',
  },
  {
    _id: '3',
    title: 'Daily Config Audit',
    description: 'Check for unauthorized config changes',
    cronExpression: '0 9 * * *',
    nextRun: Date.now() + 36000000,
    lastRun: Date.now() - 54000000,
    status: 'active',
    type: 'audit',
  },
  {
    _id: '4',
    title: 'Git Backup',
    description: 'Backup workspace to GitHub',
    cronExpression: '0 2 * * *',
    nextRun: Date.now() + 14400000,
    lastRun: Date.now() - 72000000,
    status: 'active',
    type: 'backup',
  },
];

const statusIcons = {
  active: CheckCircle,
  paused: PauseCircle,
  error: AlertCircle,
};

const statusColors = {
  active: 'text-green-400',
  paused: 'text-yellow-400',
  error: 'text-red-400',
};

const typeColors = {
  monitor: 'bg-blue-500/20 text-blue-400',
  backup: 'bg-purple-500/20 text-purple-400',
  audit: 'bg-orange-500/20 text-orange-400',
  custom: 'bg-slate-500/20 text-slate-400',
};

export function CalendarView() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calendar</h2>
          <p className="text-slate-400 mt-1">Scheduled tasks and cron jobs</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'calendar' ? 'bg-slate-700 text-white' : 'text-slate-400'
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {mockScheduledTasks.map((task) => {
          const StatusIcon = statusIcons[task.status];
          
          return (
            <div
              key={task._id}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center gap-4"
            >
              <StatusIcon className={statusColors[task.status]} size={24} />
              
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium">{task.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded ${typeColors[task.type]}`}>
                    {task.type}
                  </span>
                </div>
                <p className="text-sm text-slate-400">{task.description}</p>
              </div>

              <div className="text-right space-y-1">
                <div className="text-sm text-slate-400 flex items-center gap-2">
                  <CalendarIcon size={14} />
                  {task.cronExpression}
                </div>
                <div className="text-xs text-slate-500">
                  Next: {new Date(task.nextRun).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}