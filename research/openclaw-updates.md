# Category: OpenClaw Updates & Changelog

## v2026.2.25 (Current)
**Released:** Feb 25, 2026
**Contributors:** 23
**Security researchers:** 8+ credited

### Security Fixes
- ✅ Symlink escapes patched
- ✅ Cross-origin auth hardened  
- ✅ PKCE leak in macOS onboarding caught and killed

### New Features
- Agent-to-agent communication rebuilt (proper state machine)
- Model failover actually works when providers go down
- Android cold starts sped up

## B.O.B. Status
**Current Version:** 2026.2.25 ✅
**Gateway:** Running on port 18789 ✅
**Update Method:** npm/pnpm (stable channel)

## Update Discipline
**B.O.B. Rule:** Backup before touching anything

**Process:**
1. Backup workspace (git commit or copy)
2. Check changelog for breaking changes
3. Run update: `npm install -g openclaw@latest`
4. Verify: `openclaw --version`
5. Smoke test: Read file, send message, check logs
6. Rollback ready if issues

## Why Not Clones?
Original OpenClaw evolves fastest:
- 23 contributors
- Rapid security response
- Community focused
- Regular releases (2.24 → 2.25 in one day)
