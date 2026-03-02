# FBCA ACE (Agent Capability Enhancement) Master Plan
## Infrastructure Upgrade: From Toddlers to Super Builders

**Document Version:** 1.0  
**Created:** 2026-03-01  
**Author:** B.O.B. & Cornerstone  
**For:** Billy Nelms, Technology Lead  
**Classification:** Internal - Operations

---

## EXECUTIVE SUMMARY

**Current State:** Two functional agents (B.O.B. + Cornerstone) with manual operations, stateless execution, and limited autonomy.

**Target State:** Self-orchestrating agent ecosystem with specialization, persistence, proactive execution, and seamless human oversight.

**Timeline:** 90 days to full capability (3 phases)

**Key Principle:** Humans (Billy) approve all shipped systems. Agents execute tasks, report status, propose improvements.

---

## PART 1: ORGANIZATIONAL STRUCTURE

### 1.1 Command Hierarchy

```
BILLY NELMS (Human Authority)
    │
    ├─ Executive Dashboard (Single pane visibility)
    │   ├─ System Health
    │   ├─ Active Tasks by Agent
    │   ├─ Pending Approvals
    │   └─ Ideas Queue
    │
    ├─ ORCHESTRATOR (Cornerstone - M1 Mac)
    │   │ Role: Coordination, delegation, church ops
    │   │
    │   ├─ SCOUT (Ideas/Research Agent)
    │   │   └─ Continuous discovery + proposals
    │   │
    │   ├─ DOORY (Physical Security Agent)
    │   │   └─ Camera monitoring, door systems
    │   │
    │   ├─ CALVIN (Calendar/Events Agent)
    │   │   └─ Scheduling, PCO integration
    │   │
    │   └─ SCRIBE (Documentation Agent)
    │       └─ Reports, learning logs, handoffs
    │
    └─ B.O.B. (Curious Otter - Intel Mac)
        │ Role: Infrastructure, automation, research
        │
        ├─ SECURITY (Monitoring/Threats)
        │   └─ SSH, disk, config audits
        │
        ├─ MAKER (Automation/Scripts)
        │   └─ Backup pipelines, infra scripts
        │
        └─ MINER (Research/Tools)
            └─ Web scraping, ClawHub skills
```

### 1.2 Agent Identity System

| Agent | Creature | Emoji | Primary Function | Wake Phrase |
|-------|----------|-------|-----------------|-------------|
| Billy | Human | 🧑‍💼 | Ultimate Authority | "Billy here" |
| Cornerstone | Rock | 🪨 | Orchestrator | "Cornerstone, coordinate" |
| B.O.B. | Otter | 🦦 | Infrastructure | "B.O.B., explore" |
| SCOUT | Hawk | 🦅 | Ideas/Research | "SCOUT, envision" |
| DOORY | Dog | 🐕 | Physical Security | "DOORY, watch" |
| CALVIN | Calendar | 📅 | Scheduling | "CALVIN, plan" |
| SCRIBE | Owl | 🦉 | Documentation | "SCRIBE, record" |
| SECURITY | Shield | 🛡️ | Threat Monitoring | "SECURITY, alert" |
| MAKER | Hammer | 🔨 | Automation | "MAKER, build" |
| MINER | Pickaxe | ⛏️ | Research | "MINER, dig" |

---

## PART 2: VISIBILITY & CONTROL SYSTEM

### 2.1 Billy's Command Dashboard

**Location:** http://localhost:3000 (Mission Control upgraded)

**Panels:**

```
┌─────────────────────────────────────────────────────────────┐
│  🏠 FBCA AGENT COMMAND CENTER          [Status: OPERATIONAL]│
├─────────────────────────────────────────────────────────────┤
│  📊 SYSTEM HEALTH          │  📋 ACTIVE TASKS                │
│  ─────────────────         │  ───────────────                │
│  🟢 B.O.B.: Online         │  🔨 MAKER: Backup running       │
│  🟡 Cornerstone: Slow      │  🦅 SCOUT: Researching          │
│  🟢 7 Sub-agents: Ready    │  ⏳ 3 Tasks need approval      │
│                            │                                 │
├─────────────────────────────────────────────────────────────┤
│  🔔 PENDING APPROVALS      │  💡 IDEAS QUEUE (SCOUT)         │
│  ───────────────────       │  ───────────────────────        │
│  ⚠️  Install skill X?      │  1. Auto-sync PCO → Website     │
│  ⚠️  Deploy door script?   │     [Research complete]         │
│  ⚠️  Update camera FW?     │  2. Visitor check-in kiosk      │
│                            │     [Proposal ready]            │
│                            │  3. Predictive HVAC             │
│                            │     [Idea only]                 │
├─────────────────────────────────────────────────────────────┤
│  🎯 QUICK ACTIONS                                           │
│  [Approve All] [Review Queue] [Kill Running] [Force Refresh]│
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Daily Check-In Protocol

**When:** 8:00 AM CST (auto-triggered)
**How:** Telegram message to Billy
**Format:**

```
🌅 FBCA DAILY BRIEF — Billy

🦦 B.O.B. (Infrastructure):
   • Last 24h: 47 backups completed
   • Security: 0 alerts ✅
   • Today: Researching ClawHub skills
   • Needs: Approval for GitHub automation expansion

🪨 Cornerstone (Orchestration):
   • Last 24h: 12 door events logged
   • Active: 80 schedules running
   • Today: Migrating to shared Ollama
   • Needs: Mac M2 upgrade consideration

🦅 SCOUT (Ideas):
   • New discovery: 3 FBCA automation opportunities
   • Top proposal: Weekly visitor report automation
   • Research: PCO API integration (ready to build)

⏳ AWAITING YOUR DECISION:
   1. 👍 Approve: Auto PCO sync test (2 hrs)
   2. 👍 Approve: Security scan schedule (DONE)
   3. ❓ Question: Budget for M2 Mac?

Reply: [Approve #] or [Question] or [New task: ___]
```

---

## PART 3: TASK MANAGEMENT SYSTEM

### 3.1 Task Lifecycle

```
IDEA GENERATION
      │
      ├─ SCOUT proposes ───────┐
      ├─ Billy requests ───────┤
      └─ Agent identifies ─────┘
               │
               ▼
      PROPOSAL CREATION
      (Agent details: time, risk, resources)
               │
               ▼
      BILLY APPROVES / MODIFIES / REJECTS
               │
               ▼
      ORCHESTRATION
      (Cornerstone delegates to specialist)
               │
               ▼
      EXECUTION
      (Specialist agent builds/tests)
               │
               ▼
      QUALITY CHECK
      (Peer review + automated testing)
               │
               ▼
      DEPLOYMENT
      (Production with monitoring)
               │
               ▼
      DOCUMENTATION
      (SCRIBE records: what, why, how)
               │
               ▼
      HANDOFF
      (Runbook for future humans/agents)
```

### 3.2 Task Assignment Logic

**Who Does What Rule Engine:**

```python
def assign_task(task_type, complexity, urgency):
    if task_type in ["door_system", "physical_security"]:
        return "DOORY"
    elif task_type in ["scheduling", "pco", "calendar"]:
        return "CALVIN"
    elif task_type in ["scripting", "automation", "backup"]:
        return "MAKER"
    elif task_type in ["research", "skills", "tools"]:
        return "MINER"
    elif task_type in ["documentation", "reports", "memory"]:
        return "SCRIBE"
    elif task_type in ["ssh", "monitoring", "security_alerts"]:
        return "SECURITY"
    elif complexity == "HIGH" or task_type == "ideation":
        return "SCOUT"
    else:
        return "CORNERSTONE"  # Default orchestrator
```

---

## PART 4: PHASE IMPLEMENTATION

### PHASE 1: FOUNDATION (Days 1-30)
**Goal:** Persistence, visibility, basic orchestration

**Week 1: Visibility Dashboard**
- [ ] Upgrade Mission Control to show agent status
- [ ] Build "Daily Brief" generator
- [ ] Telegram command: `/status`
- [ ] Who: B.O.B. + Billy

**Week 2: Agent Memory**
- [ ] Create `agentMemory` table in Convex
- [ ] Each agent logs "What I did today" at 20:00
- [ ] Build "learning extractor" (find patterns in logs)
- [ ] Who: B.O.B. + SCRIBE

**Week 3: Cron Automation**
- [ ] Schedule: Daily security scan, backup verify, heartbeat
- [ ] Agents run without being asked
- [ ] Report exceptions only (normal = silent)
- [ ] Who: MAKER + B.O.B.

**Week 4: SCOUT Activation**
- [ ] Research protocols: "What should FBCA automate?"
- [ ] Daily 3-idea report at 17:00
- [ ] Billy review queue: Approve/Pass/Ask
- [ ] Who: SCOUT (new sub-agent of Cornerstone)

**Checkpoint:** Billy can see everything, agents run scheduled tasks, SCOUT pitches ideas

---

### PHASE 2: SPECIALIZATION (Days 31-60)
**Goal:** Domain-specific agents, tool integration, proactive execution

**Week 5-6: Church Systems Integration**
- [ ] PCO API connection (read events, volunteers)
- [ ] WordPress automation (backup before publish)
- [ ] MonitorCast door API research
- [ ] Who: CALVIN + DOORY + MINER

**Week 7-8: Proactive Agents**
- [ ] CALVIN: "Event tomorrow? Here's checklist"
- [ ] DOORY: "Door offline? Alert immediately"
- [ ] SECURITY: "Brute force attempt? Block IP"
- [ ] Who: All specialist agents

**Week 9-10: Human-Agent Handoff**
- [ ] Task templates: "Billy says do X" → Agent knows how
- [ ] Approval workflows: Agent proposes → Billy approves → Executes
- [ ] Failure recovery: If stuck, escalate to Billy with context
- [ ] Who: Cornerstone (orchestration logic)

**Checkpoint:** Agents handling church-specific tasks proactively, Billy only intervenes on exceptions/approvals

---

### PHASE 3: AUTONOMY (Days 61-90)
**Goal:** Self-healing, cross-agent collaboration, strategic planning

**Week 11-12: Self-Healing Systems**
- [ ] If service crashes → Auto-restart, notify Billy
- [ ] If config wrong → Rollback to last known good
- [ ] If agent stuck → Failover to peer, resume later
- [ ] Who: B.O.B. (infrastructure resilience)

**Week 13: Cross-Agent Projects**
- [ ] Example: "Welcome new visitor" → CALVIN (detect) → DOORY (badge) → SCRIBE (log)
- [ ] Multi-agent workflows without human coordination
- [ ] Who: Cornerstone (coordination layer)

**Week 14: Strategic Planning**
- [ ] Monthly review: Agents present "what we learned"
- [ ] Quarterly roadmap: SCOUT + Billy plan next 90 days
- [ ] Annual architecture: Scale, replace, upgrade decisions
- [ ] Who: Billy + All agents

**Checkpoint:** Agents are autonomous coworkers. Billy manages vision, agents handle execution.

---

## PART 5: CHECKPOINTS & GUARDRAILS

### 5.1 Mandatory Checkpoints (No Exceptions)

| Checkpoint | Who Approves | What Gets Checked |
|------------|--------------|-------------------|
| **System Deploy** | Billy | "Does this touch production? Does it have rollback plan?" |
| **New Agent Spawn** | Billy | "What's its scope? How does it fail? Who monitors it?" |
| **External Integration** | Billy | "Does it share FBCA data? Security review done?" |
| **Cost-Incurring Action** | Billy | "Budget approved? Alternative free method explored?" |
| **Access Control Change** | Billy | "Who gets access? Revocation plan? Audit trail?" |
| **Schedule Change** | Auto or Billy | "Why now? Conflict with other jobs? Notify stakeholders?" |

### 5.2 Emergency Stop Procedures

**Kill Switch Locations:**
1. Telegram: `/emergency-stop` → All agents halt
2. Dashboard: Big red button → Graceful shutdown
3. Physical: Power cycle Macs (nuclear option)

**Auto-Triggers (No Human Needed):**
- SSH brute force >10 attempts → Auto-block IP
- Disk space >95% → Delete temp files, alert Billy
- Ollama falls back to Kimi >3 times in hour → Alert Billy
- Agent crashes >3 times → Switch to sibling agent

### 5.3 Audit Trail

**Everything Logged:**
- Who did what (agent + timestamp)
- Why (task ID + approval reference)
- Result (success/failure/exception)
- Duration (for performance tracking)

**Storage:**
- GitHub (public, versioned)
- OneDrive (private, searchable)
- Convex (real-time, queryable)

**Review:**
- Weekly: Billy skims automated summary
- Monthly: Deep dive on failures
- Quarterly: Process improvement (what should agents do better?)

---

## PART 6: TOOLS & SKILLS REQUIRED

### 6.1 ClawHub Skills to Install

**Immediate (Phase 1):**
- [ ] `openclaw/scheduler` → Cron management
- [ ] `openclaw/memory` → Persistent context
- [ ] `openclaw/dashboard` → Mission Control upgrade

**Phase 2:**
- [ ] `fbca/pco-integration` → Planning Center API
- [ ] `fbca/word-press` → Website automation
- [ ] `openclaw/browser` → Web automation (if we fix it)

**Phase 3:**
- [ ] `openclaw/self-heal` → Auto-restart services
- [ ] `openclaw/multi-agent` → Workflow orchestration
- [ ] `fbca/video-stream` → Camera integration

### 6.2 Hardware Upgrades Considered

| Current | Limitation | Proposed | ROI |
|---------|------------|----------|-----|
| M1 Mac (8GB) | Ollama too slow | M2 Mac (16GB) | High |
| Tailscale free | Speed limits | Tailscale business | Medium |
| Intel Mac (16GB) | CPU not GPU | Keep + external GPU | Low |
| OneDrive personal | 1TB limit | OneDrive business | Medium |

**Decision:** Evaluate after Phase 2 (60 days)

---

## PART 7: SUCCESS METRICS

### 7.1 Agent Health KPIs

| Metric | Target | Current | Owner |
|--------|--------|---------|-------|
| Uptime | 99.5% | Unknown | B.O.B. |
| Response Time | <5 sec | 30-40 sec (M1) | Cornerstone |
| Task Completion | 95% | Unknown | All |
| False Alerts | <1/week | N/A | SECURITY |
| Billy Interventions | <5/day | 20+/day | Improvement |

### 7.2 Business Value KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Hours Saved/Week | 10+ hours | Time tracking |
| Cost Avoided | $500+/month | vs paid APIs/services |
| Errors Prevented | 90% reduction | Pre/post comparison |
| Ideas Generated | 10/week | SCOUT output |
| Ideas Implemented | 3/month | Billy approval rate |

---

## PART 8: IMMEDIATE NEXT ACTIONS

### Tomorrow (March 2, 2026)

**Morning (Billy + B.O.B.):**
1. [ ] Fix Cornerstone Ollama (shared from B.O.B.)
2. [ ] Test FBCA Leadership channel full functionality
3. [ ] Write SOUL.md improvements based on today's learnings

**Afternoon (Cornerstone + SCRIBE):**
1. [ ] First agent memory log entry
2. [ ] Document current MonitorCast workflow
3. [ ] Prepare for PCO integration research

**Evening (SCOUT):**
1. [ ] Research 3 automation opportunities
2. [ ] Queue top idea for Billy approval

---

## CONCLUSION

**We are not building a "money-making company."**

**We are building FBCA's digital nervous system:**
- Agents that remember (memory)
- Agents that coordinate (orchestration)
- Agents that improve (learning)
- Agents Billy can trust (visibility + approval gates)

**This is the foundation for everything else.**

Once this ships, we build:
- Visitor experience automation
- Predictive maintenance
- Multi-site church coordination
- Custom AI agents for other churches

**Billy approves every shipment.** Agents execute. Documentation records. System improves.

**Status: Ready for Phase 1.**

---

**Document Control:**
- Author: B.O.B. (with Cornerstone input)
- Reviewer: Billy Nelms (approval required)
- Version: 1.0 (draft)
- Next Review: March 15, 2026
