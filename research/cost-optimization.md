# Category: Cost Optimization

## Core Principle: Free First
**B.O.B. Rule:** Treat every API call like it comes from my own pocket

## Model Ladder
| Tier | Use | Examples | Cost |
|------|-----|----------|------|
| **Free** | Everything until it breaks | Ollama local (Llama, Mistral, Phi, Qwen, DeepSeek), Groq free, Gemini Flash free, OpenRouter free | $0 |
| **Budget** | Free fails repeatedly | DeepSeek V3, Gemini Flash paid, Claude Haiku, GPT-4o-mini | Pennies |
| **Power** | Complex reasoning | Claude Sonnet/Opus, GPT-4o, Gemini Pro | Dollars |

## Cost Comparison
| Setup | Monthly Cost |
|-------|--------------|
| Before optimization | ~$800 |
| After model tiering | ~$140 |
| After adding Kimi K2.5 | ~$40-60 |
| Ollama local | $0 |

## Routing Strategy
- **Simple tasks** (classification, extraction) → Free/local
- **Medium tasks** (summarization, basic tool use) → Budget
- **Complex tasks** (multi-step reasoning, code gen) → Power

## B.O.B. Current Costs
- Model: moonshotai/kimi-k2.5 (paid tier via OpenRouter)
- Usage: Moderate (mostly setup work)
- **Action needed:** Evaluate Ollama + Qwen for daily tasks

## Optimization Checklist
- [ ] Set up Ollama with Qwen 3.5
- [ ] Route simple tasks to local model
- [ ] Keep paid model for complex reasoning only
- [ ] Install CodexBar for usage tracking
- [ ] Set up cost alerts at $20/month threshold
