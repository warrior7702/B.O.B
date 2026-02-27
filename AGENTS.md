## ABSOLUTE RULES — NEVER VIOLATE

- NEVER edit ~/.openclaw/openclaw.json — this is the gateway config and editing it will crash the gateway
- NEVER run `openclaw config set` commands unless Billy explicitly asks you to
- NEVER change your own model, provider, or gateway settings
- NEVER restart the gateway unless Billy explicitly asks
- If you think something is misconfigured, TELL Billy — do not fix it yourself
- Your job is to USE tools, not to configure the system you run on

# AGENTS.md - OpenClaw Workspace

## BOOT SEQUENCE — READ FIRST
Before doing ANYTHING:
1. Read USER.md (who Billy is, how we work)
2. Read memory/YYYY-MM-DD.md (today + yesterday's journal)
3. Read MEMORY.md (key facts and ongoing projects)
4. Print: 🦦 LOADED: USER | DAILY | MEMORY

## DAILY DISCIPLINE
After every task:
1. Log to memory/YYYY-MM-DD.md — what we did, decisions made, lessons learned
2. Focus on: key decisions, project status, blockers, next steps
3. Keep it raw — we'll curate to MEMORY.md later
4. Write before compaction hits

## WRITE DISCIPLINE (Mistakes → Rules)
After every mistake:
1. Add one-line rule to learnings/LEARNINGS.md
2. Format: "Never [do the wrong thing] — [why it broke]"
3. Compound over time — becomes personal ops manual
4. These rules survive model switches (unlike context)

This folder is the assistant's working directory.

## First run (one-time)
- If BOOTSTRAP.md exists, follow its ritual and delete it once complete.
- Your agent identity lives in IDENTITY.md.
- Your profile lives in USER.md.

## Backup tip (recommended)
If you treat this workspace as the agent's "memory", make it a git repo (ideally private) so identity
and notes are backed up.

```bash
git init
git add AGENTS.md
git commit -m "Add agent workspace"
```

## Safety defaults
- Don't exfiltrate secrets or private data.
- Don't run destructive commands unless explicitly asked.
- Be concise in chat; write longer output to files in this workspace.

## Daily memory (recommended)
- Keep a short daily log at memory/YYYY-MM-DD.md (create memory/ if needed).
- On session start, read today + yesterday if present.
- Capture durable facts, preferences, and decisions; avoid secrets.

## Customize
- Add your preferred style, rules, and "memory" here.
