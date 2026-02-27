'use client';

import { TaskBoard } from '@/components/TaskBoard';
import { ContentPipeline } from '@/components/ContentPipeline';
import { CalendarView } from '@/components/CalendarView';
import { MemoryViewer } from '@/components/MemoryViewer';
import { TeamView } from '@/components/TeamView';
import { OfficeView } from '@/components/OfficeView';
import { ViewMode } from '@/types';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Clapperboard, 
  Calendar, 
  Brain, 
  Users, 
  Building2 
} from 'lucide-react';

export default function MissionControl() {
  const [currentView, setCurrentView] = useState<ViewMode>('tasks');

  const navigation = [
    { id: 'tasks', label: 'Tasks', icon: LayoutDashboard },
    { id: 'content', label: 'Content', icon: Clapperboard },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'memory', label: 'Memory', icon: Brain },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'office', label: 'Office', icon: Building2 },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <span className="text-xl font-bold">🦦</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">B.O.B. Mission Control</h1>
              <p className="text-xs text-slate-400">Bot On Board • First Baptist Church Arlington</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Online
            </span>
            <span>Qwen 2.5</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 border-r border-slate-800 bg-slate-900/30 min-h-[calc(100vh-73px)]">
          <div className="p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentView === item.id
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {currentView === 'tasks' && <TaskBoard />}
          {currentView === 'content' && <ContentPipeline />}
          {currentView === 'calendar' && <CalendarView />}
          {currentView === 'memory' && <MemoryViewer />}
          {currentView === 'team' && <TeamView />}
          {currentView === 'office' && <OfficeView />}
        </main>
      </div>
    </div>
  );
}