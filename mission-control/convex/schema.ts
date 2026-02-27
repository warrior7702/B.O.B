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
      v.literal("blocked")
    ),
    assignee: v.union(v.literal("billy"), v.literal("bob")),
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
    category: v.union(
      v.literal("daily"),
      v.literal("learning"),
      v.literal("project"),
      v.literal("system")
    ),
    createdAt: v.number(),
    tags: v.optional(v.array(v.string())),
    source: v.optional(v.string()),
  })
    .index("by_category", ["category"])
    .index("by_createdAt", ["createdAt"]),

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