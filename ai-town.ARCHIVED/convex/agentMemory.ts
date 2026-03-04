import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

/**
 * Agent Memory System
 * 
 * Purpose: Persistent storage for what agents did, learned, and decided
 * Every agent writes to this daily
 * Extracted into MEMORY.md weekly
 */

// Write a memory entry
export const writeMemory = mutation({
  args: {
    agentId: v.string(),
    instanceId: v.optional(v.string()),
    date: v.string(),
    entryType: v.union(
      v.literal('action'),
      v.literal('decision'), 
      v.literal('error'),
      v.literal('learning'),
      v.literal('task_completed')
    ),
    content: v.string(),
    relatedTask: v.optional(v.string()),
    importance: v.number(),
    tags: v.array(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db.insert('agentMemory', {
      ...args,
      timestamp: Date.now(),
    });
    return entry;
  },
});

// Get memories for an agent on a specific date
export const getAgentMemory = query({
  args: {
    agentId: v.string(),
    date: v.optional(v.string()),
    entryType: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const date = args.date || new Date().toISOString().split('T')[0];
    
    let q = ctx.db
      .query('agentMemory')
      .withIndex('agentDate', (q) => q.eq('agentId', args.agentId).eq('date', date));
    
    if (args.entryType) {
      q = q.filter((q) => q.eq(q.field('entryType'), args.entryType));
    }
    
    const memories = await q.take(args.limit || 100);
    return memories.reverse();
  },
});

// Get important memories (importance >= threshold)
export const getImportantMemories = query({
  args: {
    agentId: v.string(),
    days: v.optional(v.number()),
    minImportance: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days || 7;
    const minImportance = args.minImportance || 7;
    
    const dates = [];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    
    const memories = [];
    for (const date of dates) {
      const dayMemories = await ctx.db
        .query('agentMemory')
        .withIndex('agentDate', (q) => q.eq('agentId', args.agentId).eq('date', date))
        .filter((q) => q.gte(q.field('importance'), minImportance))
        .take(50);
      memories.push(...dayMemories);
    }
    
    return memories.sort((a, b) => (b as any).importance - (a as any).importance);
  },
});

// Get recent memories helper
export const getRecentMemories = query({
  args: {
    agentId: v.string(),
    days: v.number(),
  },
  handler: async (ctx, args) => {
    const dates = [];
    for (let i = 0; i < args.days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    
    const all = [];
    for (const date of dates) {
      const day = await ctx.db
        .query('agentMemory')
        .withIndex('agentDate', (q) => q.eq('agentId', args.agentId).eq('date', date))
        .take(100);
      all.push(...day);
    }
    
    return all;
  },
});

// Delete old memories (cleanup)
export const cleanupOldMemories = mutation({
  args: {
    olderThanDays: v.number(),
  },
  handler: async (ctx, args) => {
    const cutoff = Date.now() - (args.olderThanDays * 24 * 60 * 60 * 1000);
    
    const old = await ctx.db
      .query('agentMemory')
      .filter((q) => q.lt(q.field('timestamp'), cutoff))
      .take(1000);
    
    for (const entry of old) {
      await ctx.db.delete(entry._id);
    }
    
    return { deleted: old.length };
  },
});
