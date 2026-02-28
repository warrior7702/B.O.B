import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { agentTables } from './agent/schema';
import { aiTownTables } from './aiTown/schema';
import { conversationId, playerId } from './aiTown/ids';
import { engineTables } from './engine/schema';

export default defineSchema({
  music: defineTable({
    storageId: v.string(),
    type: v.union(v.literal('background'), v.literal('player')),
  }),

  messages: defineTable({
    conversationId,
    messageUuid: v.string(),
    author: playerId,
    text: v.string(),
    worldId: v.optional(v.id('worlds')),
  })
    .index('conversationId', ['worldId', 'conversationId'])
    .index('messageUuid', ['conversationId', 'messageUuid']),

  // Agent Communication Tables (B.O.B. ↔ Cornerstone)
  agentMessages: defineTable({
    fromAgent: v.string(),
    fromInstance: v.optional(v.string()), // which machine/instance
    toAgent: v.string(),
    messageType: v.union(
      v.literal('chat'),
      v.literal('request'),
      v.literal('response'),
      v.literal('heartbeat')
    ),
    content: v.string(),
    payload: v.optional(v.any()),
    priority: v.union(v.number(), v.string()), // 1-10 or "normal", "high", etc
    read: v.optional(v.boolean()), // whether message has been read
    sentAt: v.optional(v.number()), // timestamp
    contextId: v.optional(v.string()), // for threading
  })
    .index('toAgent', ['toAgent', 'read'])
    .index('fromAgent', ['fromAgent'])
    .index('conversation', ['contextId']),

  agentPresence: defineTable({
    agentId: v.string(),
    instanceId: v.string(), // which machine
    status: v.union(v.literal('online'), v.literal('offline'), v.literal('busy')),
    lastSeen: v.number(),
    capabilities: v.array(v.string()),
    currentTask: v.optional(v.string()),
  })
    .index('agentId', ['agentId'])
    .index('status', ['status', 'lastSeen']),

  agentLearnings: defineTable({
    agentId: v.string(),
    category: v.string(), // 'security', 'automation', 'config', etc
    learning: v.string(),
    source: v.optional(v.string()), // where it came from
    confidence: v.number(), // 0-1
    applied: v.boolean(),
  })
    .index('agentId', ['agentId', 'category'])
    .index('unapplied', ['agentId', 'applied']),

  ...agentTables,
  ...aiTownTables,
  ...engineTables,
});
