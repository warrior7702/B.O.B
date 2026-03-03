// Convex schema for B.O.B. Mission Control
// Run: npx convex dev

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("blocked"),
      v.literal("backlog")
    ),
    assignee: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    archived: v.optional(v.boolean()),
    category: v.optional(v.string()),
    fromMessageId: v.optional(v.id("messages")),
  })
    .index("by_status", ["status"])
    .index("by_assignee", ["assignee"])
    .index("by_priority", ["priority"]),

  contentPipeline: defineTable({
    title: v.string(),
    idea: v.string(),
    script: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    status: v.union(
      v.literal("idea"),
      v.literal("script"),
      v.literal("thumbnail"),
      v.literal("filming"),
      v.literal("editing"),
      v.literal("published")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
    publishDate: v.optional(v.number()),
  })
    .index("by_status", ["status"]),

  scheduledTasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    cronExpression: v.string(),
    nextRun: v.number(),
    lastRun: v.optional(v.number()),
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("error")),
    type: v.union(
      v.literal("monitor"),
      v.literal("backup"),
      v.literal("audit"),
      v.literal("custom")
    ),
  })
    .index("by_status", ["status"])
    .index("by_nextRun", ["nextRun"]),

  memories: defineTable({
    content: v.string(),
    category: v.string(),
    createdAt: v.number(),
    tags: v.optional(v.array(v.string())),
    source: v.optional(v.string()),
    agentId: v.optional(v.string()),
    relevanceScore: v.optional(v.number()),
    sourceFile: v.optional(v.string()),
    title: v.optional(v.string()),
    citations: v.optional(v.array(v.any())),
  })
    .index("by_category", ["category"])
    .index("by_createdAt", ["createdAt"]),

  ideas: defineTable({
    title: v.string(),
    description: v.string(),
    source: v.optional(v.string()), // where the idea came from
    effort: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    impact: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    status: v.union(
      v.literal("pending"),    // waiting for Billy review
      v.literal("approved"),   // Billy said yes
      v.literal("passed"),     // Billy said no
      v.literal("building"),   // agent is building it
      v.literal("done")        // shipped
    ),
    generatedBy: v.string(),   // compass
    generatedAt: v.number(),
    reviewedAt: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()), // Billy's comments
  })
    .index("by_status", ["status"])
    .index("by_generatedAt", ["generatedAt"]),

  workflows: defineTable({
    name: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("pending"),    // waiting to start
      v.literal("running"),    // in progress
      v.literal("waiting"),    // waiting for approval or external input
      v.literal("done"),       // completed
      v.literal("failed")      // errored out
    ),
    steps: v.array(v.object({
      id: v.string(),
      agent: v.string(),
      action: v.string(),
      status: v.union(v.literal("pending"), v.literal("running"), v.literal("done"), v.literal("failed"), v.literal("skipped")),
      input: v.optional(v.any()),
      output: v.optional(v.any()),
      error: v.optional(v.string()),
      startedAt: v.optional(v.number()),
      completedAt: v.optional(v.number()),
    })),
    currentStep: v.number(),
    triggeredBy: v.string(),    // what started this (cron name, agent, user)
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
    metadata: v.optional(v.any()),
  })
    .index("by_status", ["status"])
    .index("by_createdAt", ["createdAt"]),

  pendingActions: defineTable({
    title: v.string(),
    description: v.string(),
    agent: v.string(),           // who's asking (calvin, doory, bob, etc.)
    actionType: v.string(),      // door_schedule, email_send, config_change, etc.
    payload: v.any(),            // the actual data to act on when approved
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("denied"),
      v.literal("executed"),
      v.literal("expired")
    ),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    createdAt: v.number(),
    reviewedAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()),  // auto-expire stale approvals
    notes: v.optional(v.string()),      // Billy's comments
  })
    .index("by_status", ["status"])
    .index("by_agent", ["agent"])
    .index("by_createdAt", ["createdAt"]),

  agentMemory: defineTable({
    agentId: v.string(),
    date: v.string(), // YYYY-MM-DD
    summary: v.string(), // What the agent did today
    tasksCompleted: v.optional(v.array(v.string())),
    blockers: v.optional(v.array(v.string())),
    learnings: v.optional(v.array(v.string())),
    nextSteps: v.optional(v.array(v.string())),
    createdAt: v.number(),
  })
    .index("by_agentId", ["agentId"])
    .index("by_date", ["date"])
    .index("by_agentId_date", ["agentId", "date"]),

  team: defineTable({
    name: v.string(),
    role: v.string(),
    avatar: v.optional(v.string()),
    status: v.union(
      v.literal("idle"),
      v.literal("working"),
      v.literal("busy"),
      v.literal("offline")
    ),
    currentTask: v.optional(v.string()),
    skills: v.array(v.string()),
  })
    .index("by_status", ["status"]),
});