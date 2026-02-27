'use client';

import { useState } from 'react';
import { Memory } from '@/types';
import { Search, FileText, Calendar, Tag, Filter } from 'lucide-react';

// Mock data - connect to actual memory files
const mockMemories: Memory[] = [
  {
    _id: '1',
    content: 'Memory system overhaul complete. Added memoryFlush (40k token threshold), contextPruning (6h TTL), hybrid search (70/30 split).',
    category: 'system',
    createdAt: Date.now() - 86400000,
    tags: ['memory', 'config'],
    source: 'MEMORY.md',
  },
  {
    _id: '2',
    content: 'Switched default model from Kimi K2.5 (paid) to Ollama/qwen2.5 (free). Cost: $0/month.',
    category: 'learning',
    createdAt: Date.now() - 172800000,
    tags: ['cost', 'optimization'],
    source: 'memory/2026-02-26.md',
  },
  {
    _id: '3',
    content: 'Security monitors deployed: SSH brute force detection, disk space alerts, config file integrity monitoring.',
    category: 'project',
    createdAt: Date.now() - 90000000,
    tags: ['security', 'monitoring'],
    source: 'monitors/',
  },
];

const categoryColors = {
  daily: 'bg-blue-500/20 text-blue-400',
  learning: 'bg-green-500/20 text-green-400',
  project: 'bg-purple-500/20 text-purple-400',
  system: 'bg-orange-500/20 text-orange-400',
};

export function MemoryViewer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredMemories = mockMemories.filter((memory) => {
    const matchesSearch = memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || memory.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Memory</h2>
          <p className="text-slate-400 mt-1">Search through all memories and conversations</p>
        </div>
        <div className="text-sm text-slate-500">
          {filteredMemories.length} memories
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="all">All Categories</option>
            <option value="daily">Daily</option>
            <option value="learning">Learning</option>
            <option value="project">Project</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      {/* Memory List */}
      <div className="space-y-4">
        {filteredMemories.map((memory) => (
          <div
            key={memory._id}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[memory.category]}`}>
                  {memory.category}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(memory.createdAt).toLocaleDateString()}
                </span>
              </div>
              {memory.source && (
                <span className="text-xs text-slate-600 flex items-center gap-1">
                  <FileText size={12} />
                  {memory.source}
                </span>
              )}
            </div>
            
            <p className="text-slate-300 leading-relaxed mb-4">
              {memory.content}
            </p>

            {memory.tags && memory.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {memory.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded flex items-center gap-1"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}