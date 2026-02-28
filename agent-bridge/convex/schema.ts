import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  agentMessages: defineTable({
    fromAgent: v.string(),
    fromInstance: v.optional(v.string()),
    toAgent: v.string(),
    messageType: v.union(
      v.literal('chat'),
      v.literal('request'),
      v.literal('response'),
      v.literal('heartbeat')
    ),
    content: v.string(),
    payload: v.optional(v.any()),
    priority: v.union(v.number(), v.string()),
    read: v.optional(v.boolean()),
    sentAt: v.optional(v.number()),
    contextId: v.optional(v.string()),
  })
    .index('toAgent', ['toAgent', 'read'])
    .index('fromAgent', ['fromAgent'])
    .index('conversation', ['contextId']),

  agentPresence: defineTable({
    agentId: v.string(),
    instanceId: v.string(),
    status: v.union(v.literal('online'), v.literal('offline'), v.literal('busy')),
    lastSeen: v.number(),
    capabilities: v.array(v.string()),
    currentTask: v.optional(v.string()),
  })
    .index('agentId', ['agentId'])
    .index('status', ['status', 'lastSeen']),

  agentLearnings: defineTable({
    agentId: v.string(),
    category: v.string(),
    learning: v.string(),
    source: v.optional(v.string()),
    confidence: v.number(),
    applied: v.boolean(),
  })
    .index('agentId', ['agentId', 'category'])
    .index('unapplied', ['agentId', 'applied']),
});
