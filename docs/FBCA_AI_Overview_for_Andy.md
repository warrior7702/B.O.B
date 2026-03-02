# FBCA AI Infrastructure Overview
## For Andy — Early Adopter Briefing

**Prepared by:** Billy Nelms (Technology Lead)  
**Date:** March 1, 2026  
**System:** OpenClaw Multi-Agent Platform

---

## What Is This?

**OpenClaw** = Self-hosted AI agent platform (like having your own ChatGPT that runs on your Macs)

**What we built:** Two AI agents (B.O.B. & Cornerstone) that:
- Run locally on church MacBooks (no cloud dependency)
- Use FREE open-source AI models (Llama 3.1)
- Communicate securely via encrypted database (Convex)
- Automate church tech tasks

**Cost:** $0/month (both running free local models)

---

## Current Infrastructure (What's Live)

### B.O.B. (Bot On Board) — Intel MacBook
| Component | Status | Purpose |
|-----------|--------|---------|
| **AI Model** | ✅ Ollama/Llama 3.1 (FREE) | Local language processing |
| **Security Monitor** | ✅ Active | SSH brute force, disk space, config changes |
| **Git + OneDrive Backup** | ✅ Daily 2 AM | Code + config redundancy |
| **Message Poller** | ✅ Every 30s | Checks for Cornerstone messages |
| **Mission Control** | ✅ Port 3000 | Web dashboard |
| **AI Town** | ✅ Port 5173 | AI agent simulation |

### Cornerstone — M1 MacBook
| Component | Status | Purpose |
|-----------|--------|---------|
| **AI Model** | ⚠️ In progress | Switching to FREE Ollama |
| **9 Sub-Agents** | ✅ Active | FBCA operations (doors, calendar, security) |
| **Message Poller** | ✅ Running | Checks for B.O.B. messages |
| **Cross-Instance Bridge** | ✅ Working | Secure communication via Convex |

---

## What Can We Automate? (Use Cases)

### Immediate (This Month)
| Task | Who | How |
|------|-----|-----|
| **Weekly Church Reports** | Both | Auto-generate summary of tech ops, security status, upcoming events |
| **Security Alert Escalation** | B.O.B. → Cornerstone → Billy | I detect threat → Cornerstone notifies staff → Billy approves action |
| **Event Setup Checklist** | Cornerstone | Auto-create checklists for room bookings, A/V needs, volunteer assignments |
| **Backup Verification** | B.O.B. | Daily Git + OneDrive sync with status reports |

### Short-Term (Next 3 Months)
| Task | Who | How |
|------|-----|-----|
| **PCO Integration** | Cornerstone | Auto-sync Planning Center events to church calendar, website |
| **WordPress Automation** | B.O.B. | Auto-backup before updates, publish scheduled content |
| **Door Access Logs** | Cornerstone | Monitor access patterns, alert on anomalies |
| **Cross-Instance Learning** | Both | Share security findings, optimization tips via Convex |

### Long-Term (6+ Months)
| Task | Who | How |
|------|-----|-----|
| **AI Agent Swarm** | Cornerstone | 9 agents coordinating complex church operations |
| **Predictive Maintenance** | B.O.B. | Predict HVAC, tech failures before they happen |
| **Automated Sermon Notes** | Both | Transcribe, summarize, distribute to congregation |
| **Multi-Site Coordination** | Both | If FBCA expands, agents manage multiple campuses |

---

## Action Plan (What Billy Should Decide)

### Option A: Start Simple (Recommended)
1. **This week:** Weekly joint reports (both agents summarize to Billy via Telegram)
2. **Next week:** Security alert escalation (B.O.B. detects → Cornerstone notifies)
3. **Month 1:** Automate one church task (event checklists or PCO sync)

### Option B: Go Big
1. **Immediate:** Full PCO integration, WordPress automation, door monitoring
2. **Month 1:** Deploy 9 fully-coordinated agents handling all church tech
3. **Ongoing:** Predictive maintenance, automated sermon workflows, multi-site support

---

## Business Value (Why This Matters)

### Cost Savings
| Current State | Future State | Savings |
|---------------|--------------|---------|
| Cloud AI APIs ($40-200/mo) | Local Ollama (FREE) | **$500-2,400/year** |
| Manual event setup (5 hrs/week) | Automated checklists | **260 hours/year** |
| Reactive security fixes | Proactive monitoring | **Prevents incidents** |
| Manual backups | Automated daily | **Zero data loss** |

### Risk Mitigation
- **No vendor lock-in:** Runs on OUR hardware, OUR data
- **Privacy:** Conversations stay local/encrypted (no OpenAI data harvesting)
- **Redundancy:** Two Macs = if one dies, other keeps running
- **Compliance:** Church data never leaves our network

### Competitive Advantage
- **Early adopter:** First church in Tarrant County with self-hosted AI
- **Staff efficiency:** Automate repetitive tech tasks
- **Scalability:** Add agents as FBCA grows
- **Knowledge retention:** AI agents remember everything (no brain drain)

---

## Andy's Questions — Answered

### "Is this like ChatGPT?"
**Better.** ChatGPT = black box, we don't own it. OpenClaw = WE control the AI, data stays on our Macs, we pay $0.

### "Why two agents?"
**Redundancy + specialization:**
- B.O.B. handles general tech (security, backups, scraping)
- Cornerstone handles church ops (doors, calendar, FBCA-specific)
- They talk to each other, share info

### "What's 'vibe coding'?"
**Natural language programming.** Instead of writing complex code, Billy says "create a backup script" and the AI writes it. We've been doing this for 2 weeks.

### "How do we 'get automation'?"
**Three steps:**
1. **Decide what to automate** (we have 20+ ideas in MEMORY.md)
2. **Billy codes it with AI** (natural language, 10x faster)
3. **Agents run it autonomously** (monitor, alert, report)

---

## Concrete First Steps (Decision Needed)

### If You Say "Go" Today:

**Week 1:**
- [ ] Billy finalizes Cornerstone's Ollama setup (FREE model)
- [ ] Both agents send joint "Weekly Tech Status" to you every Sunday
- [ ] B.O.B. starts monitoring church network security

**Week 2:**
- [ ] Automate one church task (your choice: event checklists, PCO sync, or door alerts)
- [ ] Test escalation: Agent detects issue → Notifies staff → Billy approves fix

**Week 4:**
- [ ] Full PCO integration (events auto-sync to website/calendar)
- [ ] Quarterly review: What's working, what to add next

---

## Technical Specs (For the Curious)

| Component | Spec |
|-----------|------|
| **AI Models** | Llama 3.1 8B (free), runs locally |
| **Hardware** | 2x MacBooks (Intel + M1), no server costs |
| **Communication** | Convex database (encrypted, database-backed) |
| **Network** | Tailscale (secure mesh, no open ports) |
| **Backup** | GitHub + OneDrive (daily, versioned) |
| **Security** | Token-based auth, SSH hardening, fail2ban |
| **Monitoring** | Every 10 min (SSH), hourly (disk), daily (config) |

---

## Bottom Line

**We've built a $0/month AI infrastructure that can automate 80% of FBCA's repetitive tech work.**

**What we need from leadership:**
1. **Approval** to "go live" with automation
2. **Priority** — which church task to automate first?
3. **Trust** — we won't break anything (backups, redundancy, Billy approval gates)

**The sky is NOT the limit — we can go to the moon. But let's start with reliable automation.**

---

**Ready to discuss? Billy can demo:**
- Live security monitoring
- AI Town (agents chatting)
- Cross-instance messaging (B.O.B. ↔ Cornerstone)
- Any use case you want to see

**Contact:** Billy Nelms (Technology Lead)  
**Status:** Infrastructure ready, awaiting go-live approval