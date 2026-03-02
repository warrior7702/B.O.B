# Local LLM Comparison for FBCA ACE Plan
## March 2026 Releases & Recommendations

**Research Date:** 2026-03-01  
**Goal:** Best models for B.O.B. (Intel) + Cornerstone (M1) agent system

---

## RECENT RELEASES (Last 7 Days)

### 1. **Qwen2.5 Series** (Alibaba)
| Model | Size | Best For | M1 Compatible? |
|-------|------|----------|----------------|
| Qwen2.5:0.5b | 0.5B | Ultra-fast, simple tasks | ✅ Very fast |
| Qwen2.5:1.5b | 1.5B | Balanced speed/quality | ✅ Fast |
| Qwen2.5:3b | 3B | Good reasoning | ✅ Good |
| Qwen2.5:7b | 7.6B | Current standard | ⚠️ Slow on M1 |
| Qwen2.5:14b | 14B | High quality | ❌ Too big |
| Qwen2.5:32b | 32B | Research only | ❌ No |
| Qwen2.5:72b | 72B | Server only | ❌ No |

**Verdict:** Qwen2.5:3b ideal for M1. Qwen2.5:7b good for Intel.

---

### 2. **Gemma 3** (Google) - NEW RELEASE
| Model | Size | Best For | M1 Compatible? |
|-------|------|----------|----------------|
| gemma3:1b | 1B | Ultra-lightweight | ✅ Very fast |
| gemma3:4b | 4B | Balanced | ✅ Good |
| gemma3:12b | 12B | High quality | ⚠️ Slow |
| gemma3:27b | 27B | Research | ❌ No |

**New Features:** Better tool calling, longer context (128k)
**Verdict:** Gemma 3:4b excellent M1 option. Google's latest.

---

### 3. **Mistral Small 3** (Mistral AI) - NEW RELEASE
| Model | Size | Best For | M1 Compatible? |
|-------|------|----------|----------------|
| mistral-small:22b | 22B | Enterprise quality | ❌ Too big |
| mistral-small:24b | 24B | Latest release | ❌ No |

**Verdict:** Too big for M1. Skip for now.

---

### 4. **DeepSeek R1** - CONTROVERSIAL
| Model | Size | Best For | Issues |
|-------|------|----------|--------|
| deepseek-r1:1.5b | 1.5B | Reasoning | Censored |
| deepseek-r1:7b | 7B | Math/coding | Censored |
| deepseek-r1:14b | 14B | Complex | Censored |
| deepseek-r1:32b | 32B | Research | Censored, slow |

**⚠️ WARNING:** DeepSeek models censor responses (Chinese gov restrictions)
**Verdict:** Skip for church use. Unpredictable censorship.

---

### 5. **Llama 3.2 Series** (Meta)
| Model | Size | Best For | M1 Compatible? |
|-------|------|----------|----------------|
| llama3.2:1b | 1B | Ultra-fast | ✅ Very fast |
| llama3.2:3b | 3B | Balanced | ✅ Good |
| llama3.2:8b | 8B | Quality | ⚠️ Slow on M1 |

**Verdict:** Llama3.2:3b is solid M1 choice. Good ecosystem support.

---

## CURRENT vs RECOMMENDED

### For B.O.B. (Intel Mac - 16GB RAM)
| Current | Recommendation | Why |
|---------|------------------|-----|
| llama3.1:8b | **llama3.1:8b** OR **qwen2.5:7b** | Keep 8B, plenty of RAM |
| | Gemma 3:12b | Could try if want better tool use |

**B.O.B. has options:** Intel can handle 8B-12B comfortably.

---

### For Cornerstone (M1 Mac - 8GB RAM)
| Current | Recommendation | Why |
|---------|------------------|-----|
| llama3.1:8b (slow) | **qwen2.5:3b** | 3x faster, good quality |
| | **gemma3:4b** | Latest, excellent tool calling |
| | **llama3.2:3b** | Reliable, well-tested |
| Using B.O.B.'s Ollama | Keep this! | Best solution |

**Key insight:** Cornerstone should use B.O.B.'s shared Ollama (already configured). That solves everything.

---

## ACE PLAN MODEL STRATEGY

### Phase 1 (Now - 30 days)
**Keep current setup:**
- B.O.B.: llama3.1:8b (local, fast)
- Cornerstone: Use B.O.B.'s Ollama (shared, free)

**Why:** Already working. Don't fix what isn't broken.

---

### Phase 2 (30-60 days) - Testing Window
**Test new models on B.O.B. first:**
1. Pull `gemma3:4b` on B.O.B.
2. A/B test: llama3.1:8b vs gemma3:4b
3. If gemma better → switch both agents
4. If not → stay with llama3.1

**Why:** Gemma 3 has better tool calling (important for automation)

---

### Phase 3 (60+ days) - Optimization
**Consider specialized models:**
- **Small/fast tasks:** qwen2.5:0.5b (cron jobs, simple checks)
- **Complex reasoning:** qwen2.5:7b or llama3.1:8b
- **Tool-heavy work:** gemma3:4b or gemma3:12b (if B.O.B. can handle)

**Multi-model approach:** Different tasks, different models.

---

## IMMEDIATE RECOMMENDATION

### DON'T SWITCH NOW

**Rationale:**
1. We just got shared Ollama working (Cornerstone using B.O.B.'s)
2. ACE Plan Phase 1 starts tomorrow — don't add variables
3. Current models (llama3.1:8b) work fine
4. Better to test new models in parallel, not switch

**Parallel Testing (This Week):**
```bash
# On B.O.B. (Intel) — test without affecting production
ollama pull gemma3:4b
ollama pull qwen2.5:3b
ollama pull llama3.2:3b

# Compare speed/quality
for model in gemma3:4b qwen2.5:3b llama3.2:3b; do
  echo "Testing $model..."
  time ollama run $model "Explain agent orchestration in 3 sentences"
done
```

**Decision Point:** March 15 (2 weeks)
- If new model significantly better → switch
- If marginal improvement → stay with current

---

## RED FLAGS TO AVOID

❌ **DeepSeek R1** — Censorship unpredictable
❌ **Models >12B on M1** — Too slow, crashes
❌ **Switching during ACE Phase 1** — Too many variables
❌ **Running multiple big models** — RAM exhaustion

---

## BOTTOM LINE

| Question | Answer |
|----------|--------|
| Switch now? | **NO** — Test first, switch later |
| Best M1 model? | **qwen2.5:3b** or **gemma3:4b** |
| Best Intel model? | **llama3.1:8b** (current) or **gemma3:4b** |
| Shared Ollama? | **KEEP IT** — Works great |
| When to decide? | **March 15** — After ACE Phase 1 |

**Status: Stay the course. Test new models in parallel. Decide in 2 weeks.**

---

**Action for this week:**
- [ ] Pull gemma3:4b on B.O.B. (testing only)
- [ ] Run comparison benchmarks
- [ ] Document results in memory
- [ ] Decision on March 15
