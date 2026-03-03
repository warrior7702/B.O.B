import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Log what an agent did today
export const logDay = mutation({
  args: {
    agentId: v.string(),
    date: v.string(), // YYYY-MM-DD
    summary: v.string(),
    tasksCompleted: v.optional(v.array(v.string())),
    blockers: v.optional(v.array(v.string())),
    learnings: v.optional(v.array(v.string())),
    nextSteps: v.optional(v.array(v.string())),
  },
  returns: v.id("agentMemory"),
  handler: async (ctx, args) => {
    // Upsert: delete existing entry for this agent+date if present
    const existing = await ctx.db
      .query("agentMemory")
      .withIndex("by_agentId_date", (q) =>
        q.eq("agentId", args.agentId).eq("date", args.date)
      )
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
    return await ctx.db.insert("agentMemory", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get recent logs for an agent
export const getRecent = query({
  args: {
    agentId: v.string(),
    limit: v.optional(v.number()),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agentMemory")
      .withIndex("by_agentId", (q) => q.eq("agentId", args.agentId))
      .order("desc")
      .take(args.limit ?? 7);
  },
});

// Get all agents' logs for a specific date
export const getByDate = query({
  args: {
    date: v.string(),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agentMemory")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
  },
});

// Get all recent logs across all agents (for dashboard)
export const getAllRecent = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agentMemory")
      .order("desc")
      .take(args.limit ?? 14);
  },
});
