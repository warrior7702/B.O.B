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
      v.literal('heartbeat'),
      v.literal('intel')
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

  // Agent Memory System (Daily logging)
  agentMemory: defineTable({
    agentId: v.string(),
    instanceId: v.optional(v.string()), // which machine
    date: v.string(), // YYYY-MM-DD
    timestamp: v.number(),
    entryType: v.union(
      v.literal('action'),
      v.literal('decision'),
      v.literal('error'),
      v.literal('learning'),
      v.literal('task_completed')
    ),
    content: v.string(),
    relatedTask: v.optional(v.string()),
    importance: v.number(), // 1-10
    tags: v.array(v.string()),
    metadata: v.optional(v.any()), // flexible extra info
  })
    .index('agentDate', ['agentId', 'date'])
    .index('date', ['date'])
    .index('entryType', ['agentId', 'entryType'])
    .index('importance', ['agentId', 'importance']),

  memorySummary: defineTable({
    agentId: v.string(),
    weekOf: v.string(), // ISO week date
    keyDecisions: v.array(v.string()),
    lessonsLearned: v.array(v.string()),
    patternsIdentified: v.array(v.string()),
    nextWeekPriorities: v.array(v.string()),
    generatedAt: v.number(),
  })
    .index('agentWeek', ['agentId', 'weekOf']),

  ...agentTables,
  ...aiTownTables,
  ...engineTables,
});
