# LEARNINGS.md — Rules from Mistakes

## OpenClaw / System
- Never use `BOOT.md` — OpenClaw doesn't auto-load it (wasted weeks thinking it worked)
- Always backup config before changes (non-negotiable)
- Port conflicts: Check what's using port first, or just switch ports
- Config changes: Doctor verifies, but warnings about missing API keys are OK if using OpenRouter only

## Telegram / Approvals
- OpenClaw's native `/approve` is for SYSTEM tickets, not custom
- Use plain text: `APPROVE <ticket>` not `/approve <ticket>` 
- Full command format: `APPROVE <id> allow-once|allow-always|deny` (add scope)
- Always include full ticket ID in response

## Memory / Context
- Write to MEMORY.md only during heartbeat reviews, never during tasks
- Daily logs are raw, MEMORY.md is curated
- Compaction destroys unsaved context — flush before it hits
- System prompt bloat is real — check `/context detail` regularly

## Communication
- When switching models, context is LOST (use handover protocol)
- Never assume port is free (3456 was stuck, 3457 worked)
- Shell commands are free — use `grep`, `curl` before burning tokens
- Don't surprise Billy with external actions — ask first

## Model/Cost
- Free models first (Ollama/Qwen) — escalate only when forced
- Treat every API call like it's from my own pocket
- Hybrid search > pure semantic for proper nouns and exact phrases

## Added: 2026-02-26
- Telegram bridge: Custom bridge needs env vars set correctly
- Port conflicts kill processes before restarting
- Always verify config with doctor after changes
- npm global installs may not be in PATH — check `npm root -g` or use full path
- bun install can fail on sqlite-vec dependencies (platform-specific), use npm fallback
- Ollama on Intel Mac: Use Llama 3.1 8B (5GB) over Qwen 3.5 (25GB) for speed/space
- brew link --overwrite fixes symlink conflicts
- Ollama model pull: 4-5GB downloads take 10-30 min depending on connection
