'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { Plus, Filter, MoreHorizontal, User, Bot } from 'lucide-react';

// Mock data - replace with Convex query
const mockTasks: Task[] = [
  {
    _id: '1',
    title: 'Fix Cornerstone memory',
    description: 'Apply same memory fixes to instance #1',
    status: 'todo',
    assignee: 'bob',
    priority: 'high',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    tags: ['memory', 'instance-1'],
  },
  {
    _id: '2',
    title: 'Review security monitors',
    description: 'Verify SSH, disk, config alerts are working',
    status: 'done',
    assignee: 'bob',
    priority: 'medium',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    tags: ['security', 'monitoring'],
  },
  {
    _id: '3',
    title: 'PCO integration update',
    description: 'Update Planning Center Online API integration',
    status: 'in-progress',
    assignee: 'billy',
    priority: 'high',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    tags: ['pco', 'api'],
  },
];

const columns = [
  { id: 'todo', label: 'To Do', color: 'bg-slate-700' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-blue-600' },
  { id: 'review', label: 'Review', color: 'bg-yellow-600' },
  { id: 'done', label: 'Done', color: 'bg-green-600' },
  { id: 'blocked', label: 'Blocked', color: 'bg-red-600' },
] as const;

const priorityColors = {
  low: 'text-slate-400',
  medium: 'text-yellow-400',
  high: 'text-orange-400',
  urgent: 'text-red-400',
};

export function TaskBoard() {
  const [filter, setFilter] = useState<'all' | 'billy' | 'bob'>('all');

  const filteredTasks = mockTasks.filter(
    (task) => filter === 'all' || task.assignee === filter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Task Board</h2>
          <p className="text-slate-400 mt-1">Track what we're working on</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter */}
          <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1">
            {(['all', 'billy', 'bob'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f === 'all' ? 'All' : f === 'billy' ? 'Billy' : 'B.O.B.'}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium transition-colors">
            <Plus size={18} />
            Add Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-5 gap-4">
        {columns.map((column) => {
          const columnTasks = filteredTasks.filter(
            (task) => task.status === column.id
          );

          return (
            <div key={column.id} className="bg-slate-900/50 rounded-xl border border-slate-800">
              {/* Column Header */}
              <div className="p-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                  <span className="font-semibold">{column.label}</span>
                  <span className="ml-auto text-sm text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks */}
              <div className="p-3 space-y-3">
                {columnTasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-slate-800/50 hover:bg-slate-800 rounded-lg p-4 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm leading-tight">{task.title}</h3>
                      <button className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                    
                    {task.description && (
                      <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Assignee */}
                        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                          task.assignee === 'billy' 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-cyan-500/20 text-cyan-400'
                        }`}>
                          {task.assignee === 'billy' ? <User size={12} /> : <Bot size={12} />}
                          <span className="capitalize">{task.assignee}</span>
                        </div>
                        
                        {/* Priority */}
                        <span className={`text-xs font-medium ${priorityColors[task.priority]}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-slate-700/50 text-slate-400 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Task Placeholder */}
                <button className="w-full py-2 border-2 border-dashed border-slate-800 rounded-lg text-slate-500 hover:border-slate-700 hover:text-slate-400 transition-colors text-sm">
                  + Add task
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}