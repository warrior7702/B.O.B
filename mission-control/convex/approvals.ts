import { mutation, query, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

// Agent submits an action for Billy's approval
export const submit = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    agent: v.string(),
    actionType: v.string(),
    payload: v.any(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    expiresInHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expiresAt = args.expiresInHours
      ? now + args.expiresInHours * 60 * 60 * 1000
      : undefined;

    const id = await ctx.db.insert("pendingActions", {
      title: args.title,
      description: args.description,
      agent: args.agent,
      actionType: args.actionType,
      payload: args.payload,
      status: "pending",
      priority: args.priority,
      createdAt: now,
      expiresAt,
    });

    // Schedule Telegram ping via OpenClaw HTTP endpoint
    await ctx.scheduler.runAfter(0, internal.approvals.notifyBilly, {
      agent: args.agent,
      title: args.title,
      description: args.description,
      priority: args.priority,
    });

    return id;
  },
});

// Internal action: ping Billy via OpenClaw gateway
export const notifyBilly = internalAction({
  args: {
    agent: v.string(),
    title: v.string(),
    description: v.string(),
    priority: v.string(),
  },
  handler: async (_ctx, args) => {
    const priorityEmoji: Record<string, string> = {
      low: "🟢", medium: "🟡", high: "🟠", urgent: "🔴",
    };
    const emoji = priorityEmoji[args.priority] ?? "🔔";
    const text = `${emoji} *APPROVAL NEEDED* — ${args.agent.toUpperCase()}\n\n*${args.title}*\n${args.description}\n\n👉 Review at Mission Control → Approvals tab`;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    });
  },
});

// Billy approves an action
export const approve = mutation({
  args: { id: v.id("pendingActions"), notes: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "approved",
      reviewedAt: Date.now(),
      notes: args.notes,
    });
  },
});

// Billy denies an action
export const deny = mutation({
  args: { id: v.id("pendingActions"), notes: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "denied",
      reviewedAt: Date.now(),
      notes: args.notes,
    });
  },
});

// Get approved actions not yet executed — for DOORY/executor polling
export const getApprovedUnexecuted = query({
  args: { actionType: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const approved = await ctx.db
      .query("pendingActions")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .order("desc")
      .collect();
    if (args.actionType) {
      return approved.filter(a => a.actionType === args.actionType);
    }
    return approved;
  },
});

// Mark as executed after agent acts on approval
export const markExecuted = mutation({
  args: { id: v.id("pendingActions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: "executed" });
  },
});

// Get all pending actions (Billy's queue)
export const getPending = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("pendingActions")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .collect();
  },
});

// Get all actions (for history view)
export const getAll = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pendingActions")
      .withIndex("by_createdAt")
      .order("desc")
      .take(args.limit ?? 50);
  },
});

// Agent polls for approval status on a specific action
export const getStatus = query({
  args: { id: v.id("pendingActions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
