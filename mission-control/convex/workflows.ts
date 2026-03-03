import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new workflow
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
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
    triggeredBy: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("workflows", {
      ...args,
      status: "pending",
      currentStep: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Advance a workflow step
export const advanceStep = mutation({
  args: {
    id: v.id("workflows"),
    stepId: v.string(),
    status: v.union(v.literal("done"), v.literal("failed"), v.literal("skipped")),
    output: v.optional(v.any()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const wf = await ctx.db.get(args.id);
    if (!wf) throw new Error("Workflow not found");
    const now = Date.now();
    const steps = wf.steps.map(s =>
      s.id === args.stepId
        ? { ...s, status: args.status, output: args.output, error: args.error, completedAt: now }
        : s
    );
    const nextStep = wf.currentStep + 1;
    const allDone = steps.every(s => s.status === "done" || s.status === "skipped");
    const anyFailed = steps.some(s => s.status === "failed");
    await ctx.db.patch(args.id, {
      steps,
      currentStep: nextStep,
      status: anyFailed ? "failed" : allDone ? "done" : "running",
      updatedAt: now,
      completedAt: allDone || anyFailed ? now : undefined,
    });
  },
});

// Mark workflow as waiting (e.g. awaiting approval)
export const setWaiting = mutation({
  args: { id: v.id("workflows") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "waiting", updatedAt: Date.now() });
  },
});

// Resume a waiting workflow (e.g. approval granted)
export const resume = mutation({
  args: { id: v.id("workflows") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "running", updatedAt: Date.now() });
  },
});

// Get active workflows
export const getActive = query({
  handler: async (ctx) => {
    const running = await ctx.db.query("workflows").withIndex("by_status", q => q.eq("status", "running")).collect();
    const waiting = await ctx.db.query("workflows").withIndex("by_status", q => q.eq("status", "waiting")).collect();
    const pending = await ctx.db.query("workflows").withIndex("by_status", q => q.eq("status", "pending")).collect();
    return [...running, ...waiting, ...pending].sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get all workflows (history)
export const getAll = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db.query("workflows").withIndex("by_createdAt").order("desc").take(args.limit ?? 50);
  },
});
