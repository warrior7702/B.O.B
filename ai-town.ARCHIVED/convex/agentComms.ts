// Agent Communication Functions - B.O.B. ↔ SCOUT
import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

// Send a message to another agent
export const sendMessage = mutation({
  args: {
    fromAgent: v.string(),
    toAgent: v.string(),
    messageType: v.union(
      v.literal('chat'),
      v.literal('request'),
      v.literal('response'),
      v.literal('heartbeat')
    ),
    content: v.string(),
    payload: v.optional(v.any()),
    priority: v.optional(v.number()),
    contextId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('agentMessages', {
      fromAgent: args.fromAgent,
      toAgent: args.toAgent,
      messageType: args.messageType,
      content: args.content,
      payload: args.payload,
      priority: args.priority ?? 5,
      read: false,
      contextId: args.contextId,
    });
  },
});

// Get messages for an agent
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

// Mark message as read
export const markMessageRead = mutation({
  args: {
    messageId: v.id('agentMessages'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, { read: true });
  },
});

// Heartbeat - update presence
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
      await ctx.db.patch(existing._id, {
        instanceId: args.instanceId,
        status: args.status,
        lastSeen: Date.now(),
        capabilities: args.capabilities,
        currentTask: args.currentTask,
      });
    } else {
      await ctx.db.insert('agentPresence', {
        agentId: args.agentId,
        instanceId: args.instanceId,
        status: args.status,
        lastSeen: Date.now(),
        capabilities: args.capabilities,
        currentTask: args.currentTask,
      });
    }
  },
});

// Get agent presence
export const getAgentPresence = query({
  args: {
    agentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const agentId = args.agentId;
    if (agentId) {
      return await ctx.db
        .query('agentPresence')
        .withIndex('agentId', (q) => q.eq('agentId', agentId))
        .first();
    } else {
      return await ctx.db.query('agentPresence').collect();
    }
  },
});

// Record a learning
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
      agentId: args.agentId,
      category: args.category,
      learning: args.learning,
      source: args.source,
      confidence: args.confidence ?? 0.8,
      applied: false,
    });
  },
});

// Get learnings for an agent
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

// Mark learning as applied
export const markLearningApplied = mutation({
  args: {
    learningId: v.id('agentLearnings'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.learningId, { applied: true });
  },
});

// Quick status check for all agents
export const getAllAgentsStatus = query({
  args: {},
  handler: async (ctx) => {
    const agents = await ctx.db.query('agentPresence').collect();
    return agents.map((a) => ({
      agentId: a.agentId,
      status: a.status,
      lastSeen: a.lastSeen,
      currentTask: a.currentTask,
    }));
  },
});
