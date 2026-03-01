#!/bin/bash
# 6 PM Iran Update Reminder
# Triggers B.O.B. to check news

cd /Users/campoffice/.openclaw/workspace

# Create trigger file that user or system can detect
echo "IRAN_UPDATE_$(date +%s)" > .iran-update-trigger

# Also log it
logger "B.O.B. 6PM Iran update reminder triggered"

# Optional: Send Telegram if possible (requires bot token)
# curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
#   -d "chat_id=${TELEGRAM_CHAT_ID}" \
#   -d "text=🦦 6 PM Iran update - Ask B.O.B. for briefing" > /dev/null 2>&1

echo "Reminder set for $(date)"
