# Creating Scrapling skill wrapper

If you want `/scrapling fetch URL` command:

1. Create skill structure:
```
~/.openclaw/skills/scrapling/
├── index.ts          # Skill entry point
├── manifest.json     # Skill metadata
└── scrapling.py      # Python wrapper script
```

2. Register with OpenClaw

3. Use: `/scrapling fetch https://example.com`
```

**Time estimate:** 2-3 hours to build wrapper

**Want me to:**
- A) Create the skill wrapper now?
- B) Just use Python directly (faster)?
- C) Skip it — we have other priorities from ACE plan? 🦦