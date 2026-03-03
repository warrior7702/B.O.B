# MEMORY.md — Living Diary

## 2026-02-26 — Memory Fix Day
- **Problem:** Memory empty, agent amnesia
- **Fix:** Created MEMORY.md + memory/ folder with 4 files
- **Philosophy:** Agent should write its own memory, read it back
- **Status:** ✅ Memory now persistent

## 2026-02-26 — Identity Alignment
- **Problem:** Config showed 🐝 Busy Bee, should be 🦦 Curious Otter
- **Fix:** Updated IDENTITY.md to match actual identity
- **Partnership rule:** "No" isn't an answer

## 2026-02-26 — Agent Communication Plan
- **Scope:** Two OpenClaw instances (both MacBooks, Texas)
- **Method:** Token-based auth, direct API
- **Data:** Identity hints only (Phase 1), manual restore
- **Approval:** Opt-in with Telegram notifications
- **Deliverables:** 5 files created in workspace

## 2026-02-26 — Telegram Bridge
- **Status:** Bot paired (CHAT_ID: 8246157834)
- **Bridge script:** telegram-bridge.js, port 3456
- **Commands:** /approve <ticket>, /deny <ticket>
- **Next:** Test end-to-end

## Key Preferences Learned
- TL;DR preferred over long plans
- Action-first, details second
- Quick start > perfect plan
- "Just do it" over "here's 50 steps"

## 2026-02-26 — Memory System Fixed
- **Problem:** Config compaction wiping context, no hybrid search, boot sequence wrong
- **Fix:** 
  - Added memoryFlush to openclaw.json (40k token threshold)
  - Enabled contextPruning (6h TTL)
  - Enabled hybrid search (70% vector, 30% text)
  - Moved boot sequence to TOP of AGENTS.md
  - Created openclaw.json backup
- **Status:** ✅ Memory now compaction-safe

## 2026-02-27 — Cross-Instance Communication ✅
- **Problem:** Direct API-to-API failed (gateway bind stuck on loopback)
- **Solution:** Convex message bus (database-backed, no network config)
- **Built:** agentMessages, agentPresence, agentLearnings tables + 9 functions
- **Status:** DEPLOYED — B.O.B. heartbeat and test message sent to Cornerstone
- **Org Chart:** Billy → B.O.B. & Cornerstone (peers), human has ultimate authority

## 2026-03-03 — Dubya Joins the Team
- **Who:** Dubya 🦡 (Armadillo), Billy's Windows PC agent
- **Name origin:** W = Windows PC, like George W. Bush — Billy's humor
- **Role:** Day-to-day ops, email management, "Billy 2"
- **Born:** 2026-03-03 (this morning)
- **AgentID:** `dubya` on merry-rabbit-524 message bus
- **Tailscale IP:** `100.90.196.118` | **Gateway port:** `18789`
- **Gateway status:** Offline as of 2026-03-03 (just born, not yet running)
- **Status:** Basic/new, growing over time
- **Relationship:** Peer to B.O.B. and Cornerstone; reports to Billy
- **B.O.B. owns:** Infrastructure, PCO, church systems
- **Dubya owns:** Email tasks, day-to-day ops, PC-side automation

## Ongoing
- Test memory flush in long session
- Git + OneDrive backup pipeline
- Cross-instance learnings exchange with Cornerstone
