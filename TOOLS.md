# FBCA Agent Tools Reference
## Centralized Tool Cheat Sheet

**Purpose:** Quick reference for what tools exist, when to use them, and how to access them.

**Last Updated:** 2026-03-01

---

## AI / LLM

### Ollama (Primary)
- **What:** Local LLM inference
- **When:** Default for all agent tasks
- **Cost:** $0 (free, local)
- **Models:** llama3.1:8b (B.O.B.), shared via Tailscale (Cornerstone)
- **Access:** Built into OpenClaw

### OpenRouter (Fallback)
- **What:** API gateway for multiple LLMs
- **When:** Ollama fails or task needs better model
- **Cost:** Per-token (use sparingly)
- **Models:** kimi-k2.5, claude-3.5-sonnet, etc.
- **Access:** Configured in ~/.openclaw/openclaw.json

### xAI / Grok
- **What:** X/Twitter integration
- **When:** Twitter intelligence, social monitoring
- **Cost:** TBD
- **Access:** API key in ~/.openclaw/.secrets

### Gemini
- **What:** Google's AI (Imagen 3 for images)
- **When:** Image generation for content
- **Cost:** TBD
- **Access:** API key in ~/.openclaw/.secrets

---

## Search / Web

### web_fetch
- **What:** Quick HTML → text extraction
- **When:** Static pages, fast data grab
- **Cost:** $0
- **Limitations:** No JavaScript execution

### browser (openclaw profile)
- **What:** Isolated browser automation
- **When:** JavaScript-heavy sites, untrusted sites
- **Cost:** $0

### browser (chrome profile)
- **What:** Your signed-in browser session
- **When:** Twitter, YouTube, authenticated dashboards
- **Cost:** $0
- **Requirement:** You must attach tab via OpenClaw Browser Relay

### Brave Search API
- **What:** Web search without Google
- **When:** Research, finding information
- **Cost:** Free tier available
- **Access:** API key needed in ~/.openclaw/.secrets
- **Status:** NOT CONFIGURED (need BRAVE_API_KEY)

---

## Data / Storage

### Convex
- **What:** Database + real-time sync
- **When:** Agent messages, presence, learnings
- **Cost:** Free tier (generous)
- **Access:** Built into OpenClaw
- **Projects:** 
  - dashing-coyote-31 (AI Town)
  - merry-mandrill-290 (Mission Control)

### GitHub
- **What:** Version control, backups
- **When:** Code, docs, configs
- **Cost:** Free (public repos)
- **Access:** SSH keys configured
- **Repos:**
  - warrior7702/B.O.B (this workspace)

### OneDrive
- **What:** Cloud file storage
- **When:** Document delivery, backups
- **Cost:** Included with Microsoft 365
- **Access:** Local sync at ~/OneDrive - First Baptist Church Arlington

### .secrets file
- **What:** Centralized API keys
- **When:** Storing sensitive credentials
- **Location:** ~/.openclaw/.secrets
- **Security:** Gitignored, chmod 600

---

## Networking

### Tailscale
- **What:** Secure mesh VPN
- **When:** Agent communication, Ollama sharing
- **Cost:** Free (personal)
- **IPs:**
  - B.O.B.: 100.99.198.88
  - Cornerstone: 100.96.16.30

### Localhost
- **What:** Local development services
- **Ports:**
  - 3000: Mission Control
  - 5173: AI Town
  - 18789: OpenClaw Gateway
  - 11434: Ollama (B.O.B.)

---

## Communication

### Telegram (FBCA Leadership)
- **What:** Primary human-agent interface
- **When:** All communication with Billy
- **Members:** Billy, Andy, B.O.B., Cornerstone

### Agent Message Bus (Convex)
- **What:** Agent-to-agent communication
- **When:** B.O.B. ↔ Cornerstone coordination
- **Method:** Polling every 30 seconds

### AgentMail
- **What:** Email automation
- **When:** Sending emails programmatically
- **Cost:** TBD
- **Access:** API key in ~/.openclaw/.secrets
- **Status:** Not yet configured

---

## Development

### Node.js
- **What:** JavaScript runtime
- **When:** OpenClaw skills, Mission Control
- **Version:** v24.14.0
- **Location:** /usr/local/bin/node

### Python
- **What:** Scripting language
- **When:** Scrapling, automation scripts
- **Version:** 3.12

### Git
- **What:** Version control CLI
- **When:** Commits, backups, history

### ClawHub
- **What:** OpenClaw skill repository
- **When:** Installing new agent capabilities
- **Command:** `clawhub install <skill>`

---

## Deployment

### GitHub Pages
- **What:** Static site hosting
- **When:** Public documentation, demos
- **Cost:** Free
- **Access:** GitHub repo settings

### here.now
- **What:** Instant static hosting
- **When:** Quick prototypes, internal tools
- **Cost:** Free
- **Command:** `npx here.now`

### Netlify
- **What:** Production-grade hosting
- **When:** Production deployments
- **Cost:** Paid (use sparingly)
- **Decision:** Ask Billy before using

---

## Monitoring / Health

### SSH Monitor
- **What:** Brute force detection
- **When:** Running every 10 minutes
- **Location:** ~/monitors/ssh-monitor.sh

### Disk Monitor
- **What:** Disk space alerts
- **When:** Running every hour
- **Location:** ~/monitors/disk-monitor.sh

### Config Audit
- **What:** Unauthorized change detection
- **When:** Daily
- **Location:** ~/monitors/config-audit.sh

---

## Church Systems

### Planning Center Online (PCO)
- **What:** Church management software
- **When:** Events, volunteers, check-ins
- **Access:** API integration planned (Phase 2)

### MonitorCast
- **What:** Door access control
- **When:** Door schedules, access logs
- **URL:** http://100.123.239.124:8080
- **Access:** Web UI, API research needed

### MediaMTX
- **What:** Video streaming server
- **When:** Camera streaming (future)
- **URL:** http://100.123.239.124:5002
- **Status:** Development/testing

---

## Quick Decision Tree

```
Need to fetch web data?
├── Static HTML? → web_fetch
├── JavaScript required? → browser (isolated)
└── Need to be signed in? → browser (chrome)

Need AI inference?
├── Default → Ollama (free)
└── Ollama failing? → OpenRouter (costs $)

Need to store data?
├── Permanent/structured → Convex
├── Code/docs → GitHub
├── Files/documents → OneDrive
└── Secrets → .secrets file

Need to communicate?
├── Human (Billy) → Telegram
├── Agent (Cornerstone) → Convex message bus
└── External (email) → AgentMail (configured?)

Need to deploy?
├── Static site → GitHub Pages
├── Quick prototype → here.now
└── Production → Netlify (ask Billy first)
```

---

## Tool Status Legend

| Status | Meaning |
|--------|---------|
| ✅ Active | Working, use freely |
| ⚠️ Configurable | Needs setup/configuration |
| ❌ Not Set Up | Requires installation/config |
| 💰 Paid | Costs money, use sparingly |

---

## Adding New Tools

**Before adding:**
1. Check if existing tool can do it
2. Verify free option exhausted
3. Ask Billy if paid tool needed

**After adding:**
1. Update this file
2. Document in learnings if notable
3. Add to .secrets if API key needed

---

**Questions about tools?** Check this file first, then ask.
