import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Store an extracted learning/pattern
export const store = mutation({
  args: {
    agentId: v.string(),
    title: v.string(),
    insight: v.string(),
    pattern: v.union(
      v.literal("recurring-blocker"),
      v.literal("repeated-task"),
      v.literal("efficiency-win"),
      v.literal("failure-pattern"),
      v.literal("general")
    ),
    frequency: v.optional(v.number()), // how many times seen
    recommendation: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  returns: v.id("memories"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("memories", {
      title: args.title,
      content: args.insight,
      category: "learning",
      agentId: args.agentId,
      tags: args.tags ?? [args.pattern],
      source: "learning-extractor",
      createdAt: Date.now(),
    });
  },
});

// Get recent learnings
export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("memories")
      .withIndex("by_category", (q) => q.eq("category", "learning"))
      .order("desc")
      .take(args.limit ?? 20);
  },
});
