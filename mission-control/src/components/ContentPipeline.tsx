'use client';

import { ContentItem } from '@/types';
import { Lightbulb, FileText, Image, Video, CheckCircle } from 'lucide-react';

const stages = [
  { id: 'idea', label: 'Idea', icon: Lightbulb, color: 'bg-slate-600' },
  { id: 'script', label: 'Script', icon: FileText, color: 'bg-blue-600' },
  { id: 'thumbnail', label: 'Thumbnail', icon: Image, color: 'bg-purple-600' },
  { id: 'filming', label: 'Filming', icon: Video, color: 'bg-yellow-600' },
  { id: 'editing', label: 'Editing', icon: FileText, color: 'bg-orange-600' },
  { id: 'published', label: 'Published', icon: CheckCircle, color: 'bg-green-600' },
] as const;

export function ContentPipeline() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Content Pipeline</h2>
        <p className="text-slate-400 mt-1">Track content from idea to published</p>
      </div>

      <div className="grid grid-cols-6 gap-4">
        {stages.map((stage) => {
          const Icon = stage.icon;
          return (
            <div key={stage.id} className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-lg ${stage.color} flex items-center justify-center`}>
                  <Icon size={16} className="text-white" />
                </div>
                <span className="font-medium">{stage.label}</span>
              </div>
              <div className="text-2xl font-bold text-slate-400">0</div>
              <div className="text-xs text-slate-500">items</div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center">
        <Lightbulb className="mx-auto mb-4 text-slate-600" size={48} />
        <h3 className="text-lg font-medium mb-2">No content yet</h3>
        <p className="text-slate-400 mb-4">Add your first content idea to get started</p>
        <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium transition-colors">
          Add Content Idea
        </button>
      </div>
    </div>
  );
}