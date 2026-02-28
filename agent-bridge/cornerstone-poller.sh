#!/bin/bash
# Cornerstone Message Poller
# Checks Convex for new messages every 30 seconds
# Place this in Cornerstone's workspace and run: ./cornerstone-poller.sh

cd ~/ai-town 2>/dev/null || cd ~/workspace/ai-town 2>/dev/null || cd ~/mission-control 2>/dev/null

echo "🪨 Cornerstone Poller Starting..."
echo "Checking for messages to 'cornerstone' every 30 seconds"
echo ""

SEEN_FILE=".seen-messages.txt"

# Initialize seen file
touch "$SEEN_FILE"

while true; do
    # Get messages from Convex
    MESSAGES=$(npx convex run agentComms:getMessagesForAgent '{"toAgent": "cornerstone", "limit": 10}' 2>/dev/null | grep -o '"_id":"[^"]*"' | cut -d'"' -f4)
    
    NEW_COUNT=0
    for MSG_ID in $MESSAGES; do
        if ! grep -q "$MSG_ID" "$SEEN_FILE"; then
            NEW_COUNT=$((NEW_COUNT + 1))
            echo "$MSG_ID" >> "$SEEN_FILE"
        fi
    done
    
    if [ $NEW_COUNT -gt 0 ]; then
        echo "[$(date '+%H:%M:%S')] 📨 $NEW_COUNT new message(s) from B.O.B.!"
        echo "Run: npx convex run agentComms:getMessagesForAgent '{\"toAgent\": \"cornerstone\"}'"
    else
        echo -n "."
    fi
    
    sleep 30
done
