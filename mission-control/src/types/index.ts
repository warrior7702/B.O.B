// Types for Mission Control

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';
  assignee: 'billy' | 'bob';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: number;
  updatedAt: number;
  dueDate?: number;
  tags?: string[];
}

export interface ContentItem {
  _id: string;
  title: string;
  idea: string;
  script?: string;
  thumbnailUrl?: string;
  status: 'idea' | 'script' | 'thumbnail' | 'filming' | 'editing' | 'published';
  createdAt: number;
  updatedAt: number;
  publishDate?: number;
}

export interface ScheduledTask {
  _id: string;
  title: string;
  description?: string;
  cronExpression: string;
  nextRun: number;
  lastRun?: number;
  status: 'active' | 'paused' | 'error';
  type: 'monitor' | 'backup' | 'audit' | 'custom';
}

export interface Memory {
  _id: string;
  content: string;
  category: 'daily' | 'learning' | 'project' | 'system';
  createdAt: number;
  tags?: string[];
  source?: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'idle' | 'working' | 'busy' | 'offline';
  currentTask?: string;
  skills: string[];
}

export type ViewMode = 'tasks' | 'content' | 'calendar' | 'memory' | 'team' | 'office';