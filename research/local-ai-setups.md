# Category: Local AI & Free Model Setups

## Qwen 3.5 via Ollama (Recommended Free Setup)
**Models Available:**
- Qwen3.5-Flash (hosted, 1M context, free tier)
- Qwen3.5-35B-A3B (surpasses Qwen3-235B)
- Qwen3.5-122B-A10B (near frontier quality)
- Qwen3.5-27B

**Setup Steps:**
1. Download Ollama at ollama.com
2. `ollama pull qwen3.5-cloud` (or specific variant)
3. `npx openclaw --model qwen3.5`

**Cost:** Free weekly allowance, resets automatically
**Usage:** Someone streamed for weeks, used only 13.9% of limit

## GLM 4.7 Flash via Ollama
**Setup:**
1. Install Ollama
2. `ollama run glm4.7-flash` (~25GB download)
3. Connect to OpenClaw

**Stats:** 270,000+ downloads in recent weeks
**Performance:** Beats some paid models in coding benchmarks

## Claude Code Local Setup
**Stack:**
- Ollama for local model hosting
- GLM4.7-Flash or Qwen as brain
- Zero API costs, zero data leaving machine

**Command:** `claude --model claude-opus-4.5 --dangerously-skip-permissions -p "prompt"`

## Kimi K2.5 Cloud
**Best for:** Daily tasks (free tier)
**Usage:** Handles ~70% of workload
**Remaining 30%:** Use Sonnet 4.6 (coding) or Opus 4.6 (complex reasoning)
**Cost Savings:** $800/month → $140/month → $40-60/month with proper routing

## Model Routing Strategy
| Task | Model | Cost |
|------|-------|------|
| Daily tasks | Kimi K2.5 Cloud | Free |
| Coding/analysis | Sonnet 4.6 | Budget |
| Complex reasoning | Opus 4.6 | Power |
| Local everything | Ollama + Qwen/GLM | $0 |

## B.O.B. Policy
**Free first. Always.**
- Start with Ollama local models
- Escalate to paid only when forced
- Every API call is treated like it comes from my own pocket
