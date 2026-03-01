#!/bin/bash
# BILLY: Copy this to Cornerstone and run it

echo "=== Ollama Fix Script ==="

# 1. Backup config
cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.backup.$(date +%Y%m%d_%H%M%S)
echo "✓ Config backed up"

# 2. Add OLLAMA_API_KEY to the plist (this is the KEY FIX)
plutil -replace EnvironmentVariables.OLLAMA_API_KEY -string "ollama-local" ~/Library/LaunchAgents/ai.openclaw.gateway.plist
echo "✓ OLLAMA_API_KEY added to plist"

# 3. Verify it's there
plutil -p ~/Library/LaunchAgents/ai.openclaw.gateway.plist | grep OLLAMA
echo ""

# 4. FULL KILL - need sudo for stubborn processes
echo "Killing all openclaw processes..."
sudo pkill -9 -f openclaw
sleep 3

# 5. Make sure it's dead
if pgrep -q openclaw; then
    echo "Process still running, force killing..."
    sudo kill -9 $(pgrep openclaw)
    sleep 2
fi

# 6. Reload with new env var
echo "Reloading gateway..."
launchctl unload ~/Library/LaunchAgents/ai.openclaw.gateway.plist 2>/dev/null
sleep 2
launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.plist
sleep 5

# 7. Check if running
echo ""
echo "Gateway status:"
pgrep -la openclaw

echo ""
echo "=== DONE ==="
echo "NOW: Start a NEW session with /new or /reset"
echo "Do NOT reuse the current session - it will still fail"