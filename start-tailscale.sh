#!/bin/bash
# Start all services bound to Tailscale (0.0.0.0)

echo "🦦 Starting services with Tailscale access..."
echo "Your Tailscale IP: 100.99.198.88"
echo ""

# Kill any existing
pkill -9 -f "next.*3000\|vite.*5173" 2>/dev/null
sleep 2

# Mission Control on 0.0.0.0:3000
cd /Users/campoffice/.openclaw/workspace/mission-control
echo "Starting Mission Control on 0.0.0.0:3000..."
nohup npx next dev -H 0.0.0.0 -p 3000 > /tmp/mission-control.log 2>&1 &
echo "  PID: $!"

# AI Town on 0.0.0.0:5173  
cd /Users/campoffice/.openclaw/workspace/ai-town
echo "Starting AI Town on 0.0.0.0:5173..."
nohup npx vite --host 0.0.0.0 --port 5173 > /tmp/ai-town.log 2>&1 &
echo "  PID: $!"

# Poller already running
echo ""
echo "Poller: Already running (checking Convex)"
echo ""
echo "✅ All services started!"
echo ""
echo "Access URLs:"
echo "  Local:       http://localhost:3000 (Mission Control)"
echo "  Local:       http://localhost:5173 (AI Town)"
echo "  Tailscale:   http://100.99.198.88:3000 (Mission Control)"
echo "  Tailscale:   http://100.99.198.88:5173 (AI Town)"
echo ""
echo "To view logs: tail -f /tmp/mission-control.log /tmp/ai-town.log"
