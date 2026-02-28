import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const sendMessage = mutation({
  args: {
    fromAgent: v.string(),
    fromInstance: v.optional(v.string()),
    toAgent: v.string(),
    messageType: v.union(v.literal('chat'), v.literal('request'), v.literal('response'), v.literal('heartbeat')),
    content: v.string(),
    payload: v.optional(v.any()),
    priority: v.optional(v.union(v.number(), v.string())),
    contextId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('agentMessages', {
      ...args,
      priority: args.priority ?? 5,
      read: false,
    });
  },
});

export const getMessagesForAgent = query({
  args: {
    toAgent: v.string(),
    unreadOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let messages = await ctx.db
      .query('agentMessages')
      .withIndex('toAgent', (q) => q.eq('toAgent', args.toAgent))
      .order('desc')
      .take(args.limit ?? 50);
    if (args.unreadOnly) {
      messages = messages.filter((m) => !m.read);
    }
    return messages;
  },
});

export const markMessageRead = mutation({
  args: { messageId: v.id('agentMessages') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, { read: true });
  },
});

export const heartbeat = mutation({
  args: {
    agentId: v.string(),
    instanceId: v.string(),
    status: v.union(v.literal('online'), v.literal('offline'), v.literal('busy')),
    capabilities: v.array(v.string()),
    currentTask: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('agentPresence')
      .withIndex('agentId', (q) => q.eq('agentId', args.agentId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, lastSeen: Date.now() });
    } else {
      await ctx.db.insert('agentPresence', { ...args, lastSeen: Date.now() });
    }
  },
});

export const getAgentPresence = query({
  args: { agentId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.agentId) {
      return await ctx.db
        .query('agentPresence')
        .withIndex('agentId', (q) => q.eq('agentId', args.agentId))
        .first();
    }
    return await ctx.db.query('agentPresence').collect();
  },
});

export const recordLearning = mutation({
  args: {
    agentId: v.string(),
    category: v.string(),
    learning: v.string(),
    source: v.optional(v.string()),
    confidence: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('agentLearnings', {
      ...args,
      confidence: args.confidence ?? 0.8,
      applied: false,
    });
  },
});

export const getLearnings = query({
  args: {
    agentId: v.string(),
    category: v.optional(v.string()),
    unappliedOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let learnings = await ctx.db
      .query('agentLearnings')
      .withIndex('agentId', (q) => q.eq('agentId', args.agentId))
      .order('desc')
      .take(100);
    if (args.category) {
      learnings = learnings.filter((l) => l.category === args.category);
    }
    if (args.unappliedOnly) {
      learnings = learnings.filter((l) => !l.applied);
    }
    return learnings;
  },
});

export const markLearningApplied = mutation({
  args: { learningId: v.id('agentLearnings') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.learningId, { applied: true });
  },
});
