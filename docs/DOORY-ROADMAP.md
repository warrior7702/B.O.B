# DOORY — Full Roadmap
**Written:** 2026-03-04  
**Owner:** Billy Nelms / FBCA Tech  
**Stack:** Kestrel/.NET backend at 100.123.239.124:5002, MonitorCast at :8080

---

## The Big Picture

Replace MonitorCast as the primary access control brain. Eliminate 4 on-campus servers. Let Spot AI own video. Let DOORY own everything else.

**End state:** One system. Minimal maintenance. Full control.

---

## Phase 1 — Manual Unlock ✅ DONE
- "Unlock this door now" works
- Telegram approval bridge works
- DOORY posts to MonitorCast on approval

---

## Phase 2 — Regular Schedules (Next)
Get standing recurring unlock times into the system as permanent events.

- Sunday service windows (multiple doors, multiple times)
- Wednesday night
- Office hours
- Any other standing weekly/daily schedules

**How:** Add recurring events via DOORY calendar UI. These run automatically without any approval needed — they're pre-approved standing schedules.

**Goal:** MonitorCast's recurring schedule config fully mirrored in DOORY.

---

## Phase 3 — PCO Sync (Door Access Requests)
Pull Planning Center events → detect "Door Access" resource requests → parse the 4 questions inside → propose a door schedule → Telegram approval → auto-execute.

**PCO API investigation needed:**
- Endpoint: `/api/v2/resource_requests` (or similar)
- Filter for: resource type = "Door Access"
- Parse 4 questions inside each request (Billy testing with real event today)
- Map answers → door IDs + time windows

**Pipeline:**
```
PCO event created
  → DOORY polls PCO API (every 15 min or webhook)
  → Detects Door Access resource request
  → Parses 4 questions → proposes schedule
  → Telegram to Billy: "Approve door schedule for [Event]? [Yes/No]"
  → Approved → DOORY creates schedule → executes at event time
```

**Test:** Billy has a real PCO event to test with today.

---

## Phase 4 — Lane Viewer (Camera Integration)
Live door camera feeds in Mission Control / DOORY UI for visual review.

**Two options to test:**
1. **Spot AI API** — cloud-based, AI-enhanced, already capturing footage
2. **Local 10.5.5.x feeds** — RTSP/IP cameras on campus network, zero cloud dependency

**Plan:** Build viewer for both, show Andy, pick the one that looks better / performs better.

**Andy review:** Nice UI, live feeds alongside door status. Goal is to make it look polished enough that Andy signs off on wider rollout.

---

## Phase 5 — Small Rollout
~5 people. Internal staff only. Real usage, real feedback.

---

## Decision Point — After Rollout

### Option A: Full Standalone (Preferred)
Take complete control of Cards, Codes, and Schedules. MonitorCast stays as cold backup only.

**Scope:**
- Read/write personnel (cards, codes, access levels)
- Full schedule management (no MonitorCast UI needed)
- Personnel sync: add/remove people, change access without touching MonitorCast

**Why this wins:**
- 4 servers → potentially 1 (Dubya's i9 handles DOORY, Spot AI handles video)
- Eliminates MonitorCast dependency before that server dies
- Full control of the data model
- MonitorCast hardware still executes commands — we just don't need its brain

**Server consolidation math:**
| Current | Future |
|---------|--------|
| Server 1: MS Access + Wade video | DOORY on Dubya (already running) |
| Server 2: Main BLD video | Spot AI (decommission) |
| Server 3: Student Center video | Spot AI (decommission) |
| Server 4: PCB video | Spot AI (decommission) |
| **4 servers** | **0-1 servers** |

### Option B: Hardware Upgrade Path
New reader hardware, lab testing, Bluetooth features, mobile app.

**Scope:**
- Source modern BLE/NFC readers
- Lab test with one door
- Build mobile credential app (phone as key card)
- Future: visitor credentials, temporary access, audit logs

**Decision criteria:** Does Option A hit a wall before full personnel control? If so, hardware upgrade becomes necessary anyway.

---

## Agent Assignments

| Task | Owner | Status |
|------|-------|--------|
| Regular schedule entry | Billy + Cornerstone | Phase 2 |
| PCO API investigation | B.O.B. | Phase 3 |
| PCO Door Access question parsing | B.O.B. | Phase 3 |
| Telegram approval pipeline | B.O.B. | Phase 3 |
| Spot AI API integration | B.O.B. | Phase 4 |
| Local 10.5.5.x camera viewer | B.O.B. | Phase 4 |
| MonitorCast personnel API research | Cornerstone | Phase 5 / Decision |
| Lane viewer UI polish | B.O.B. | Phase 4 |

---

## Key Constraints
- MonitorCast server is aging — do not depend on it indefinitely
- 4 questions inside PCO Door Access request = the parse target
- Spot AI is the video future — local feeds are backup/comparison only
- Wade video already decommissioning to Spot AI
- No breaking changes to current unlock flow while building next phases
