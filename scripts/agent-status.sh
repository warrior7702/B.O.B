#!/bin/bash
# Agent Startup Status Reporter
# Run this on OpenClaw startup to announce availability

AGENT_ID="bob"
HOSTNAME=$(hostname)
TAILSCALE_IP=$(tailscale ip -4 2>/dev/null || echo "unknown")

# Get current OpenClaw model
MODEL=$(openclaw config get agents.defaults.model.primary 2>/dev/null || echo "unknown")
FALLBACK=$(openclaw config get agents.defaults.model.fallbacks 2>/dev/null || echo "none")

# Check Ollama
OLLAMA_STATUS="down"
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    OLLAMA_STATUS="running"
fi

# Check peer (Cornerstone)
PEER_IP="100.96.16.30"
PEER_STATUS="offline"
if curl -m 2 -s http://$PEER_IP:18789/status > /dev/null 2>&1; then
    PEER_STATUS="online"
fi

# Build status message
STATUS=$(cat <<EOF
🦦 $AGENT_ID Online — $HOSTNAME
- Model: $MODEL
- Fallback: $FALLBACK
- Ollama: $OLLAMA_STATUS (port 11434)
- Shared Ollama: available on $TAILSCALE_IP:11434
- Cornerstone: $PEER_STATUS at $PEER_IP
- Health: OK
- Time: $(date)
EOF
)

# Send to Billy via OpenClaw message
openclaw message send "$STATUS" || echo "Failed to send startup status"

# Log to memory
mkdir -p ~/.openclaw/workspace/memory
echo "## $(date +%Y-%m-%d-%H:%M) — Agent Startup

$STATUS" >> ~/.openclaw/workspace/memory/$(date +%Y-%m-%d).md

# Send heartbeat to Convex (if ai-town configured)
if [ -d ~/ai-town ]; then
    cd ~/ai-town
    # npx convex run agentComms:heartbeat --data '{"agentId": "'$AGENT_ID'", "status": "online", "currentTask": "startup"}' 2>/dev/null || true
fi

echo "Startup status reported: $AGENT_ID online"
