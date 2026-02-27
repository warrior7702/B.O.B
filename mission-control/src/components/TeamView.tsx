'use client';

import { TeamMember } from '@/types';
import { User, Bot, Circle } from 'lucide-react';

const mockTeam: TeamMember[] = [
  {
    _id: '1',
    name: 'Billy',
    role: 'Technology Lead',
    status: 'working',
    currentTask: 'Reviewing Mission Control',
    skills: ['Leadership', 'Strategy', 'FBCA Operations'],
  },
  {
    _id: '2',
    name: 'B.O.B.',
    role: 'Bot On Board',
    status: 'working',
    currentTask: 'Building Mission Control',
    skills: ['Coding', 'System Design', 'Automation'],
  },
  {
    _id: '3',
    name: 'WordPress Agent',
    role: 'Web Developer',
    status: 'offline',
    skills: ['WordPress', 'PHP', 'Security'],
  },
  {
    _id: '4',
    name: 'PCO Agent',
    role: 'Integration Specialist',
    status: 'offline',
    skills: ['APIs', 'Planning Center', 'Automation'],
  },
];

const statusColors = {
  idle: 'bg-slate-500',
  working: 'bg-green-500 animate-pulse',
  busy: 'bg-yellow-500',
  offline: 'bg-slate-700',
};

export function TeamView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Team</h2>
        <p className="text-slate-400 mt-1">Digital organization structure</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {mockTeam.map((member) => (
          <div
            key={member._id}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-5"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl">
                {member.name === 'Billy' ? '👤' : member.name === 'B.O.B.' ? '🦦' : '🤖'}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{member.name}</h3>
                  <div className={`w-2 h-2 rounded-full ${statusColors[member.status]}`}></div>
                </div>
                <p className="text-sm text-cyan-400 mb-2">{member.role}</p>
                
                {member.currentTask && (
                  <p className="text-sm text-slate-400 mb-3">
                    Working on: {member.currentTask}
                  </p>
                )}

                <div className="flex flex-wrap gap-2">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-3 border-2 border-dashed border-slate-800 rounded-xl text-slate-500 hover:border-slate-700 hover:text-slate-400 transition-colors">
        + Add Team Member
      </button>
    </div>
  );
}