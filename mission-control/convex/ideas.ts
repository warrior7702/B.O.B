import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const submit = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    source: v.optional(v.string()),
    effort: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    impact: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    generatedBy: v.string(),
    tags: v.optional(v.array(v.string())),
  },
  returns: v.id("ideas"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("ideas", {
      ...args,
      status: "pending",
      generatedAt: Date.now(),
    });
  },
});

export const review = mutation({
  args: {
    id: v.id("ideas"),
    status: v.union(
      v.literal("approved"),
      v.literal("passed"),
      v.literal("building"),
      v.literal("done")
    ),
    notes: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      notes: args.notes,
      reviewedAt: Date.now(),
    });
  },
});

export const getPending = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    return await ctx.db
      .query("ideas")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .take(20);
  },
});

export const getAll = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ideas")
      .order("desc")
      .take(args.limit ?? 50);
  },
});
