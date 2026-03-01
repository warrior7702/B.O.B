# Task: Leverage OpenClaw Community Assets
**Created:** 2026-03-01 2:22 PM  
**Status:** In Progress  
**Priority:** High

## Current Audit Results

### INSTALLED SKILLS (5 core)
| Skill | Status | Purpose |
|-------|--------|---------|
| clawhub | ✅ Working | Skill installer/manager |
| healthcheck | ✅ Working | System security hardening |
| skill-creator | ✅ Working | Build custom skills |
| weather | ✅ Working | Outdoor event planning |
| openclaw-mem0 | ⚠️ Broken | Memory system (needs fix) |
| bluebubbles | ❌ Broken | iMessage integration (needs zod) |

### MISSING CRITICAL SKILLS (6 needed)
| FBCA Need | Skill to Find | Priority |
|-----------|---------------|----------|
| Door control | habitat, unifi-access, doory | HIGH |
| Cameras | unifi-protect, camera, frigate | HIGH |
| Calendar/Events | gcal, pco, ical | MEDIUM |
| Security monitoring | security, fail2ban, crowdsec | MEDIUM |
| Backups | restic, borg, cloud-backup | LOW (custom working) |
| Communication | telegram, email, slack | MEDIUM (partial working) |

## Research Actions Needed

### 1. ClawHub Search Commands
```bash
clawhub search door
clawhub search camera  
clawhub search calendar
clawhub search security
clawhub list --top 20
```

### 2. GitHub Community Patterns
- `openclaw multi-agent` configs
- `openclaw church automation` examples
- `openclaw camera api` integrations
- `openclaw executive dashboard` setups

### 3. Discord Channels to Monitor
- #showcase — Real implementations
- #help — Solved problems
- #skills — New releases

### 4. Specific Problems to Solve
| Problem | Community Resource |
|---------|-------------------|
| Ollama auth errors | GitHub issues "ollama auth" |
| Telegram group setup | GitHub issues "telegram group" |
| Camera API access | GitHub issues "camera api" |
| Multi-agent coordination | Discord multi-agent thread |

## Next Steps

1. [ ] Run ClawHub search for missing skills
2. [ ] GitHub search for working configurations
3. [ ] Join Discord, ask about church setups
4. [ ] Install found skills (prioritize doors/cameras)
5. [ ] Document working patterns for FBCA

## Definition of Done
- All 6 missing skill categories have solutions identified
- At least 2 critical skills (door + camera) installed and tested
- Community pattern documented for future use
- No more "reinventing" — everything starts with "did someone else solve this?"

---
**Last Updated:** 2026-03-01 2:22 PM