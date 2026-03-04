import { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  Plus,
  MoreHorizontal,
  Loader2,
  RefreshCw,
  X
} from 'lucide-react';

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  tags?: string[];
  dueDate?: number | null;
  createdAt: number;
  updatedAt: number;
};

const ASSIGNEES = ['bob', 'cornerstone', 'dubya', 'billy'];

export function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'review' | 'done' | 'backlog' | 'blocked'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignee: 'bob', priority: 'medium', category: '' });

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to fetch tasks', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 15000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  const updateTask = async (id: string, patch: Partial<Task>) => {
    setTasks(prev => prev.map(t => t._id === id ? { ...t, ...patch } : t));
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
  };

  const createTask = async () => {
    if (!newTask.title.trim()) return;
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newTask, status: 'todo' }),
    });
    const created = await res.json();
    setTasks(prev => [created, ...prev]);
    setNewTask({ title: '', description: '', assignee: 'bob', priority: 'medium', category: '' });
    setShowNewTask(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'review': return <AlertCircle className="w-5 h-5 text-orange-400" />;
      case 'blocked': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Circle className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'in-progress': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'review': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'blocked': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'backlog': return 'bg-slate-600/30 text-slate-500 border-slate-600/30';
      default: return 'bg-slate-700/50 text-slate-400 border-slate-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/10';
      case 'high': return 'text-orange-400 bg-orange-500/10';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10';
      default: return 'text-slate-400 bg-slate-700/50';
    }
  };

  const getAssigneeColor = (assignee: string) => {
    switch (assignee) {
      case 'bob': return 'bg-cyan-500';
      case 'cornerstone': return 'bg-purple-500';
      case 'dubya': return 'bg-orange-500';
      case 'billy': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  const cycleStatus = (current: string) => {
    const cycle: Record<string, Task['status']> = {
      backlog: 'todo', todo: 'in-progress', 'in-progress': 'review', review: 'done', done: 'backlog', blocked: 'todo'
    };
    return cycle[current] ?? 'todo';
  };

  const filteredTasks = tasks.filter(t => {
    const statusMatch = filter === 'all' || t.status === filter;
    const assigneeMatch = assigneeFilter === 'all' || t.assignee === assigneeFilter;
    return statusMatch && assigneeMatch;
  });

  const countByStatus = (s: string) => tasks.filter(t => t.status === s).length;
  const activeCount = tasks.filter(t => t.status !== 'done' && t.status !== 'backlog').length;
  const completedCount = countByStatus('done');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Task Board</h2>
          <p className="text-slate-400 text-sm mt-1">
            {activeCount} active · {completedCount} done · {tasks.length} total
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchTasks} className="p-2 text-slate-400 hover:text-white transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowNewTask(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* New Task Form */}
      {showNewTask && (
        <div className="bg-slate-800 border border-cyan-500/30 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">New Task</h3>
            <button onClick={() => setShowNewTask(false)}><X className="w-4 h-4 text-slate-400 hover:text-white" /></button>
          </div>
          <input
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-cyan-500 focus:outline-none"
            placeholder="Task title..."
            value={newTask.title}
            onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))}
          />
          <textarea
            className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-cyan-500 focus:outline-none"
            placeholder="Description (optional)..."
            rows={2}
            value={newTask.description}
            onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))}
          />
          <div className="flex gap-3 flex-wrap">
            <select
              value={newTask.assignee}
              onChange={e => setNewTask(p => ({ ...p, assignee: e.target.value }))}
              className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-cyan-500 focus:outline-none"
            >
              {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <select
              value={newTask.priority}
              onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}
              className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-cyan-500 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <input
              className="flex-1 bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:border-cyan-500 focus:outline-none"
              placeholder="Category (optional)"
              value={newTask.category}
              onChange={e => setNewTask(p => ({ ...p, category: e.target.value }))}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowNewTask(false)} className="px-4 py-2 text-slate-400 hover:text-white text-sm">Cancel</button>
            <button onClick={createTask} className="px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm hover:bg-cyan-600">Create Task</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-center">
        <div className="flex gap-1 flex-wrap">
          {(['all', 'todo', 'in-progress', 'review', 'done', 'blocked'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === s ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {s === 'all' ? `All (${tasks.length})` : `${s} (${countByStatus(s)})`}
            </button>
          ))}
        </div>
        <div className="w-px h-5 bg-slate-700" />
        <div className="flex gap-1 flex-wrap">
          {(['all', ...ASSIGNEES]).map(a => (
            <button
              key={a}
              onClick={() => setAssigneeFilter(a)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                assigneeFilter === a ? 'bg-slate-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {a !== 'all' && <span className={`w-2 h-2 rounded-full ${getAssigneeColor(a)}`} />}
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="grid gap-3">
        {filteredTasks.map(task => (
          <div
            key={task._id}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-cyan-500/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => updateTask(task._id, { status: cycleStatus(task.status) })}
                className="mt-1 hover:opacity-80 transition-opacity flex-shrink-0"
                title="Cycle status"
              >
                {getStatusIcon(task.status)}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white">{task.title}</h3>
                    {task.description && (
                      <p className="text-slate-400 text-sm mt-1">{task.description}</p>
                    )}
                  </div>
                  <button className="text-slate-500 hover:text-slate-300 flex-shrink-0">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <select
                    value={task.status}
                    onChange={e => updateTask(task._id, { status: e.target.value as Task['status'] })}
                    className={`px-2 py-0.5 rounded text-xs font-medium capitalize cursor-pointer border ${getStatusColor(task.status)} bg-transparent`}
                  >
                    {['backlog','todo','in-progress','review','done','blocked'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

                  <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>

                  <select
                    value={task.assignee}
                    onChange={e => updateTask(task._id, { assignee: e.target.value })}
                    className="flex items-center gap-1 text-xs text-slate-400 bg-slate-700/50 border border-slate-600 px-2 py-0.5 rounded cursor-pointer"
                  >
                    {ASSIGNEES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>

                  {task.category && (
                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {task.category}
                    </span>
                  )}

                  {task.tags && task.tags.length > 0 && task.tags.map((tag: string) => (
                    <span key={tag} className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700 border-dashed">
            <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
}
