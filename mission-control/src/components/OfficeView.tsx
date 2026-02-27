'use client';

import { Monitor, Coffee, Code, MessageSquare } from 'lucide-react';

export function OfficeView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Office</h2>
        <p className="text-slate-400 mt-1">Visual workspace status</p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 min-h-[400px]">
        {/* Office Floor Plan */}
        <div className="grid grid-cols-3 gap-8">
          {/* Billy's Desk */}
          <div className="bg-slate-800/50 rounded-lg p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-2xl">
              👤
            </div>
            <h3 className="font-medium mb-1">Billy</h3>
            <p className="text-sm text-slate-400 mb-3">Technology Lead</p>
            <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
              <Monitor size={16} />
              <span>Working</span>
            </div>
          </div>

          {/* B.O.B.'s Desk */}
          <div className="bg-slate-800/50 rounded-lg p-6 text-center border-2 border-cyan-500/30">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl">
              🦦
            </div>
            <h3 className="font-medium mb-1 text-cyan-400">B.O.B.</h3>
            <p className="text-sm text-slate-400 mb-3">Bot On Board</p>
            <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
              <Code size={16} />
              <span>Coding</span>
            </div>
          </div>

          {/* Empty Desk */}
          <div className="bg-slate-800/30 rounded-lg p-6 text-center opacity-50">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-700 flex items-center justify-center text-2xl">
              🪑
            </div>
            <h3 className="font-medium mb-1">Available</h3>
            <p className="text-sm text-slate-500 mb-3">Hire Agent</p>
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
              <Coffee size={16} />
              <span>Offline</span>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-8 p-4 bg-slate-800/30 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Active Agents: 2/3</span>
            <span className="text-slate-400">Tasks in Progress: 1</span>
            <span className="text-green-400">System: Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}