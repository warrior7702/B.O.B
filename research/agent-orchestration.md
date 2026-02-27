# Category: Agent Orchestration & Swarms

## The Problem: One AI Can't Do Both
Context windows are zero-sum:
- Fill with code → no room for business context
- Fill with customer history → no room for codebase

## Solution: Two-Tier System
| Layer | Role | Context |
|-------|------|---------|
| **Orchestrator** (OpenClaw) | High strategy, coordination | Business context, customer data, meeting notes |
| **Workers** (Codex/Claude) | Code execution | Codebase, specific tasks |

## Real Example: Zoe System
**Results:**
- 94 commits in one day (3 client calls, never opened editor)
- 7 PRs in 30 minutes
- ~50 commits/day average

**Architecture:**
1. **Orchestrator (Zoe)** spawns agents, writes prompts, picks models, monitors progress
2. **Agents** work in isolated git worktrees with tmux sessions
3. **Cron job** babysits agents every 10 minutes
4. **3 AI reviewers** check every PR (Codex, Gemini, Claude)
5. **Human review** only after all checks pass

## Agent Types
| Agent | Best For | Example |
|-------|----------|---------|
| **Codex** | Backend logic, complex bugs, multi-file refactors | 90% of tasks |
| **Claude Code** | Frontend work, git operations | Faster, fewer permission issues |
| **Gemini** | Design sensibility | Generate HTML/CSS specs first |

## Workflow
1. Customer request → Orchestrator scopes with business context
2. Spawn agent with detailed prompt (includes customer history)
3. Agent creates worktree, works in tmux session
4. Agent creates PR when done
5. 3 AI reviewers analyze code
6. CI runs tests (lint, types, unit, E2E)
7. Human gets Telegram notification: "PR ready"
8. Human reviews screenshot, merges

## Key Insight
The orchestrator has context the agents don't:
- Customer history
- Meeting notes
- What was tried before
- Why it failed

This context gets translated into precise prompts for each coding agent.

## Ralph Loop V2
When agents fail, orchestrator doesn't just respawn with same prompt:
- Agent out of context? → "Focus only on these three files"
- Agent wrong direction? → "Customer wanted X, not Y"
- Agent needs clarification? → "Here's customer's email"

Success patterns get logged. Over time, orchestrator writes better prompts.

## Bottleneck: RAM
Each agent needs:
- Own worktree
- Own node_modules
- Parallel TypeScript compiler, test runner

**Limit:** 4-5 agents on 16GB Mac Mini before swapping
**Solution:** Mac Studio M4 Max 128GB ($3,500)

## B.O.B. Application
Not yet implemented. Future consideration for FBCA:
- Agent for WordPress updates
- Agent for PCO integrations  
- Agent for event ops
- Orchestrator (me) coordinating all three
