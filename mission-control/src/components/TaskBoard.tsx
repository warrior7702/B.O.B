import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Doc, Id } from '../../convex/_generated/dataModel';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  Plus,
  MoreHorizontal,
  Calendar,
  Loader2
} from 'lucide-react';

export function TaskBoard() {
  const tasks = useQuery(api.tasks.list, {});
  const updateTask = useMutation(api.tasks.update);
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'review' | 'done'>('all');

  if (!tasks) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter((t: Doc<'tasks'>) => t.status === filter);

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

  const handleStatusChange = async (taskId: Id<'tasks'>, newStatus: Doc<'tasks'>['status']) => {
    await updateTask({ id: taskId, status: newStatus });
  };

  const columns = [
    { id: 'todo', label: 'To Do', count: tasks.filter((t: Doc<'tasks'>) => t.status === 'todo').length },
    { id: 'in-progress', label: 'In Progress', count: tasks.filter((t: Doc<'tasks'>) => t.status === 'in-progress').length },
    { id: 'review', label: 'Review', count: tasks.filter((t: Doc<'tasks'>) => t.status === 'review').length },
    { id: 'done', label: 'Done', count: tasks.filter((t: Doc<'tasks'>) => t.status === 'done').length },
  ];

  const activeCount = tasks.filter((t: Doc<'tasks'>) => t.status !== 'done' && !t.archived).length;
  const completedCount = tasks.filter((t: Doc<'tasks'>) => t.status === 'done').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Active Tasks</h2>
          <p className="text-slate-400 text-sm mt-1">
            {activeCount} active, {completedCount} completed
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          All Tasks ({tasks.length})
        </button>
        {columns.map(col => (
          <button
            key={col.id}
            onClick={() => setFilter(col.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === col.id 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {col.label} ({col.count})
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="grid gap-4">
        {filteredTasks.map((task: Doc<'tasks'>) => (
          <div
            key={task._id}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-cyan-500/5"
          >
            <div className="flex items-start gap-4">
              <button 
                onClick={() => {
                  const nextStatus = {
                    'backlog': 'todo',
                    'todo': 'in-progress',
                    'in-progress': 'review',
                    'review': 'done',
                    'done': 'backlog',
                    'blocked': 'todo'
                  }[task.status] as Doc<'tasks'>['status'];
                  handleStatusChange(task._id, nextStatus);
                }}
                className="mt-1 hover:opacity-80 transition-opacity"
              >
                {getStatusIcon(task.status)}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{task.title}</h3>
                    {task.description && (
                      <p className="text-slate-400 text-sm mt-1">{task.description}</p>
                    )}
                  </div>
                  <button className="text-slate-500 hover:text-slate-300">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value as Doc<'tasks'>['status'])}
                    className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${getStatusColor(task.status)} cursor-pointer border`}
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                    <option value="blocked">Blocked</option>
                  </select>
                  
                  <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${getPriorityColor(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                  
                  <span className="flex items-center gap-1 text-sm text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                    {task.assignee}
                  </span>
                  
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex gap-1">
                      {task.tags.map((tag: string) => (
                        <span key={tag} className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700 border-dashed">
            <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No tasks in this column</p>
          </div>
        )}
      </div>
    </div>
  );
}
