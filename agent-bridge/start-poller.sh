#!/bin/bash
# Start B.O.B. Message Poller

cd /Users/campoffice/.openclaw/workspace/agent-bridge

# Check if already running
if pgrep -f "node poller.js" > /dev/null; then
  echo "🦦 Poller already running!"
  echo "To restart: pkill -f 'node poller.js' && ./start-poller.sh"
  exit 1
fi

echo "🦦 Starting B.O.B. Message Poller..."
echo "Logs will appear here. Press Ctrl+C to stop."
echo ""

node poller.js
