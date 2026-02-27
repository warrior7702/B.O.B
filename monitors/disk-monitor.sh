#!/bin/bash
# Disk Space Monitor - Qwen 2.5 Production Version
# Alerts when disk usage exceeds 90%

set -euo pipefail

# Source credentials
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -f "$SCRIPT_DIR/.env" ] && source "$SCRIPT_DIR/.env"

THRESHOLD=90
LOG_FILE="/Users/campoffice/.openclaw/workspace/monitors/disk-alerts.log"

# Get disk usage for root partition
usage=$(df -h / | awk 'NR==2 {gsub(/%/,""); print $5}')

log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

send_alert() {
    local message="🚨 Disk usage critical: ${usage}% on $(hostname -s)"
    
    # Telegram alert if configured
    if [[ -n "${TELEGRAM_BOT_TOKEN:-}" && -n "${TELEGRAM_CHAT_ID:-}" ]]; then
        curl -fsSL -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
            -d "chat_id=${TELEGRAM_CHAT_ID}" \
            -d "text=${message}" > /dev/null 2>&1 || true
    fi
    
    # macOS notification
    osascript -e "display notification \"${message}\" with title \"Disk Alert\"" 2>/dev/null || true
}

if (( usage >= THRESHOLD )); then
    log_message "CRITICAL: Disk usage at ${usage}% (threshold: ${THRESHOLD}%)"
    send_alert
    exit 1
else
    log_message "OK: Disk usage at ${usage}%"
    exit 0
fi