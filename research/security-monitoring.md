# Category: Security & Monitoring

## Critical Alerts to Set Up

### 1. Failed SSH Login Detection
**What:** Bot messages you instantly when brute force attempts occur
**Value:** Caught 47 failed attempts in one week, auto-blocked all

### 2. Disk Space Monitoring
**Trigger:** Warns at 90% capacity
**Prevents:** Server crashes from full disks

### 3. Daily Config Audit
**What:** Checks for unauthorized config changes every morning
**Catches:** Drift, mistakes, potential breaches

## Implementation
Ask OpenClaw to set up these alerts. It will:
- Monitor auth logs for SSH failures
- Check disk usage on schedule
- Compare config files against known-good baselines
- Send Telegram notifications when triggered

## Best Practices
- **Don't connect agents directly to sensitive systems** (email, CRMs, public-facing)
- **Risk:** Prompt injection attacks
- **Solution:** Keep agents sandboxed, manual approval for external actions

## OpenClaw Security (v2026.2.25)
Recent patches:
- Symlink escapes patched
- Cross-origin auth hardened
- PKCE leak in macOS onboarding fixed
- Agent-to-agent communication rebuilt with state machine
- Model failover actually works when providers go down

## B.O.B. Security Posture
- Backup before every config change (mandatory)
- Never surprise Billy with external actions
- Ask before sending emails, pushing to Git, posting anywhere
- Private things stay private (church data = sacred)
