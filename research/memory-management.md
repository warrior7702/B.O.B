# Category: Memory Management Best Practices

## The Core Problem
Agents wake up with amnesia every session. Without memory files, you're hiring someone incredible but wiping their brain every morning.

## The 3 Essential Files
1. **SOUL.md** - Agent's personality/DNA (how it talks, rules, values)
2. **USER.md** - Notebook about YOU (name, job, projects, preferences)
3. **MEMORY.md** - Long-term brain (diary of decisions, lessons, updates)

## Advanced: Daily Journal Pattern
- Create `memory/` folder
- Write one file per day (YYYY-MM-DD.md)
- Agent reviews notes periodically
- Moves important stuff to MEMORY.md

## Memory Flush Configuration (CRITICAL)
Prevents data loss during compaction:

```json
{
  "agents": {
    "defaults": {
      "compaction": {
        "reserveTokensFloor": 20000,
        "memoryFlush": {
          "enabled": true,
          "softThresholdTokens": 40000,
          "systemPrompt": "Session nearing compaction. Store durable memories now.",
          "prompt": "Write lasting notes to memory/YYYY-MM-DD.md. Focus on: key decisions, project status, lessons learned, active blockers."
        }
      }
    }
  }
}
```

## Context Pruning
Smooths memory management:
```json
{
  "agent": {
    "contextPruning": {
      "mode": "cache-ttl",
      "ttl": "6h",
      "keepLastAssistants": 3
    }
  }
}
```

## Hybrid Search (Better Recall)
```json
{
  "agents": {
    "defaults": {
      "memorySearch": {
        "query": {
          "hybrid": {
            "enabled": true,
            "vectorWeight": 0.7,
            "textWeight": 0.3
          }
        }
      }
    }
  }
}
```

## QMD: Advanced Search Backend
**Install:** `bun install -g https://github.com/tobi/qmd`

**Features:**
- BM25 + vector + reranker
- Can index external folders (Obsidian vaults)
- Falls back to built-in search if QMD fails

## mem0ai Plugin
- Stores memories outside conversation window
- Compaction cannot touch it
- Auto-detects important info
- Injects relevant context before responses

**Install:** `openclaw plugins install @mem0/openclaw-mem0`

## cognee_: Knowledge Graph
- Builds relationship web between people, projects, concepts
- Best for complex, interconnected projects
- Most involved setup

## Rules from Real Users
1. Only AGENTS.md, SOUL.md, TOOLS.md, IDENTITY.md, USER.md, HEARTBEAT.md, MEMORY.md auto-load
2. Boot sequence goes at TOP of AGENTS.md
3. Write discipline > read discipline
4. Never write directly to MEMORY.md during tasks (use daily logs)
5. LEARNINGS.md is underrated (one-line rules from mistakes)
6. Test retrieval, not just storage
7. Handover protocol for model switches (write state to daily log)
8. Run `/context detail` regularly to find bloat
9. Hybrid search beats pure semantic
10. Compaction isn't the enemy — unwritten context is

## B.O.B. Current Setup
✅ MEMORY.md created with key facts
✅ memory/ folder with categorized files
✅ Identity aligned (🦦 not 🐝)
⚠️ Need: memoryFlush config in openclaw.json
⚠️ Need: Hybrid search enabled
⚠️ Need: Daily journal discipline
