#!/bin/bash
# SSH Brute Force Monitor for macOS
# Sends Telegram alert on 5+ failed attempts in 10 minutes

THRESHOLD=5
WINDOW_MINUTES=10
LOG_FILE="/Users/campoffice/.openclaw/workspace/monitors/ssh-alerts.log"

# Count failed SSH attempts in last N minutes
failed_attempts=$(log show --predicate 'eventMessage contains "authentication failure" OR eventMessage contains "Failed password"' --last ${WINDOW_MINUTES}m 2>/dev/null | wc -l)

if [ "$failed_attempts" -ge "$THRESHOLD" ]; then
    MESSAGE="🚨 SSH ALERT: ${failed_attempts} failed login attempts in last ${WINDOW_MINUTES} minutes on $(hostname -s)"
    echo "[$(date)] $MESSAGE" >> "$LOG_FILE"
    
    # Telegram alert
    if [ -n "${TELEGRAM_BOT_TOKEN:-}" ] && [ -n "${TELEGRAM_CHAT_ID:-}" ]; then
        curl -fsSL -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
            -d "chat_id=${TELEGRAM_CHAT_ID}" \
            -d "text=${MESSAGE}" > /dev/null 2>&1
    fi
    
    # macOS notification
    osascript -e "display notification \"${MESSAGE}\" with title \"Security Alert\"" 2>/dev/null
    
    exit 1
fi

exit 0