'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Compass, ThumbsUp, ThumbsDown, MessageCircle, Zap, TrendingUp } from 'lucide-react';

const effortColor = (e: string) => e === 'low' ? 'text-green-400' : e === 'medium' ? 'text-yellow-400' : 'text-red-400';
const impactColor = (i: string) => i === 'high' ? 'text-cyan-400' : i === 'medium' ? 'text-blue-400' : 'text-slate-400';
const statusBadge = (s: string) => {
  switch (s) {
    case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'passed': return 'bg-slate-700 text-slate-400 border-slate-600';
    case 'building': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    case 'done': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    default: return 'bg-slate-700 text-slate-400';
  }
};

export function IdeasQueue() {
  const ideas = useQuery(api.ideas.getAll, { limit: 30 }) ?? [];
  const review = useMutation(api.ideas.review);

  const pending = ideas.filter((i: any) => i.status === 'pending');
  const reviewed = ideas.filter((i: any) => i.status !== 'pending');

  const handleReview = async (id: string, status: 'approved' | 'passed') => {
    await review({ id: id as any, status });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Compass className="w-6 h-6 text-cyan-400" />
          COMPASS Ideas Queue
        </h2>
        <span className="text-sm text-slate-400">
          {pending.length} pending review
        </span>
      </div>

      {/* Pending Ideas */}
      {pending.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
          <Compass className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No ideas pending. COMPASS runs daily at 8 AM.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Pending Review</h3>
          {pending.map((idea: any) => (
            <div key={idea._id} className="bg-slate-800/50 border border-yellow-500/20 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-white text-lg mb-1">{idea.title}</h4>
                  <p className="text-slate-400 text-sm mb-3">{idea.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span className={effortColor(idea.effort)}>Effort: {idea.effort}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span className={impactColor(idea.impact)}>Impact: {idea.impact}</span>
                    </span>
                    {idea.source && (
                      <span className="text-slate-500">Source: {idea.source}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleReview(idea._id, 'approved')}
                    className="flex items-center gap-1 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors border border-green-500/30 text-sm"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReview(idea._id, 'passed')}
                    className="flex items-center gap-1 px-3 py-2 bg-slate-700 text-slate-400 rounded-lg hover:bg-slate-600 transition-colors text-sm"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    Pass
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviewed Ideas */}
      {reviewed.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Reviewed</h3>
          {reviewed.map((idea: any) => (
            <div key={idea._id} className="bg-slate-800/30 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-300">{idea.title}</h4>
                  {idea.notes && <p className="text-xs text-slate-500 mt-1">{idea.notes}</p>}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border capitalize ${statusBadge(idea.status)}`}>
                  {idea.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
