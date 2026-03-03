'use client';

import { TaskBoard } from '@/components/TaskBoard';
import { AgentStatusPanel } from '@/components/AgentStatus';
import { ContentPipeline } from '@/components/ContentPipeline';
import { CalendarView } from '@/components/CalendarView';
import { MemoryViewer } from '@/components/MemoryViewer';
import { TeamView } from '@/components/TeamView';
import { OfficeView } from '@/components/OfficeView';
import { IdeasQueue } from '@/components/IdeasQueue';
import { DoorStatus } from '@/components/DoorStatus';
import { ApprovalsQueue } from '@/components/ApprovalsQueue';
import { CronHealth } from '@/components/CronHealth';
import { Workflows } from '@/components/Workflows';
import { AgentComms } from '@/components/AgentComms';
import { ViewMode } from '@/types';
import { useState } from 'react';
import {
  LayoutDashboard,
  Activity,
  Clapperboard,
  Calendar,
  Brain,
  Users,
  Building2,
  Compass,
  DoorOpen,
  ShieldCheck,
  GitBranch,
  Radio,
  Menu,
  X,
} from 'lucide-react';

const navigation = [
  { id: 'status',     label: 'Status',     short: 'Status',    icon: Activity },
  { id: 'tasks',      label: 'Tasks',      short: 'Tasks',     icon: LayoutDashboard },
  { id: 'approvals',  label: 'Approvals',  short: 'Approve',   icon: ShieldCheck },
  { id: 'doors',      label: 'DOORY',      short: 'Doors',     icon: DoorOpen },
  { id: 'comms',      label: 'Comms',      short: 'Comms',     icon: Radio },
  { id: 'workflows',  label: 'Workflows',  short: 'Flows',     icon: GitBranch },
  { id: 'ideas',      label: 'COMPASS',    short: 'Ideas',     icon: Compass },
  { id: 'cronhealth', label: 'Cron Health',short: 'Crons',     icon: Activity },
  { id: 'calendar',   label: 'Calendar',   short: 'Cal',       icon: Calendar },
  { id: 'memory',     label: 'Memory',     short: 'Memory',    icon: Brain },
  { id: 'content',    label: 'Content',    short: 'Content',   icon: Clapperboard },
  { id: 'team',       label: 'Team',       short: 'Team',      icon: Users },
  { id: 'office',     label: 'Office',     short: 'Office',    icon: Building2 },
] as const;

// Bottom nav shows first 5 — most-used on mobile
const BOTTOM_NAV_IDS = ['status', 'approvals', 'doors', 'comms', 'tasks'];

export default function MissionControl() {
  const [currentView, setCurrentView] = useState<ViewMode>('status');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentNav = navigation.find(n => n.id === currentView);

  const handleNav = (id: ViewMode) => {
    setCurrentView(id);
    setDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 shrink-0 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg">
              🦦
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold leading-tight truncate">B.O.B. Mission Control</h1>
              <p className="text-[11px] text-slate-400 hidden sm:block truncate">Bot On Board • First Baptist Church Arlington</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Online indicator — desktop */}
            <span className="hidden md:flex items-center gap-2 text-sm text-slate-400">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Online
            </span>
            <span className="hidden md:block text-sm text-cyan-400">anthropic/claude-sonnet-4-6</span>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
              onClick={() => setDrawerOpen(v => !v)}
              aria-label="Open navigation"
            >
              {drawerOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile: current section label */}
        <div className="md:hidden px-4 pb-2 text-xs text-slate-400 font-medium uppercase tracking-wider">
          {currentNav?.label}
        </div>
      </header>

      {/* ── Mobile slide-down drawer ────────────────────────── */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-20 flex flex-col" style={{ top: '0' }}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          {/* Drawer panel */}
          <div className="relative mt-[64px] bg-slate-900 border-b border-slate-700 shadow-xl z-10 max-h-[80vh] overflow-y-auto">
            <div className="p-3 grid grid-cols-3 gap-2">
              {navigation.map(item => {
                const Icon = item.icon;
                const active = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id as ViewMode)}
                    className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl transition-colors ${
                      active
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-[11px] font-medium leading-tight text-center">{item.short}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop layout ──────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* Sidebar — desktop only */}
        <nav className="hidden md:block w-56 lg:w-64 border-r border-slate-800 bg-slate-900/30 shrink-0">
          <div className="p-3 space-y-1 sticky top-[73px]">
            {navigation.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as ViewMode)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    currentView === item.id
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto min-w-0 pb-20 md:pb-6">
          {currentView === 'status'     && <AgentStatusPanel />}
          {currentView === 'tasks'      && <TaskBoard />}
          {currentView === 'content'    && <ContentPipeline />}
          {currentView === 'calendar'   && <CalendarView />}
          {currentView === 'memory'     && <MemoryViewer />}
          {currentView === 'team'       && <TeamView />}
          {currentView === 'office'     && <OfficeView />}
          {currentView === 'ideas'      && <IdeasQueue />}
          {currentView === 'doors'      && <DoorStatus />}
          {currentView === 'approvals'  && <ApprovalsQueue />}
          {currentView === 'cronhealth' && <CronHealth />}
          {currentView === 'workflows'  && <Workflows />}
          {currentView === 'comms'      && <AgentComms />}
        </main>
      </div>

      {/* ── Mobile bottom nav ───────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-slate-800 safe-area-bottom">
        <div className="flex">
          {BOTTOM_NAV_IDS.map(id => {
            const item = navigation.find(n => n.id === id)!;
            const Icon = item.icon;
            const active = currentView === item.id;
            return (
              <button
                key={id}
                onClick={() => handleNav(item.id as ViewMode)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-1 transition-colors ${
                  active ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{item.short}</span>
              </button>
            );
          })}
          {/* "More" button opens drawer */}
          <button
            onClick={() => setDrawerOpen(v => !v)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-1 transition-colors ${
              drawerOpen ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Menu size={20} />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
