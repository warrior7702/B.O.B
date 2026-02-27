#!/bin/bash
# Daily Config Audit
# Checks critical config files against baseline hashes

set -euo pipefail

# Source credentials
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -f "$SCRIPT_DIR/.env" ] && source "$SCRIPT_DIR/.env"

AUDIT_LOG="/Users/campoffice/.openclaw/workspace/monitors/config-audit.log"
BASELINE_DIR="/Users/campoffice/.openclaw/workspace/monitors/baselines"

# Files to monitor
CONFIG_FILES=(
    "$HOME/.openclaw/openclaw.json"
    "$HOME/.openclaw/exec-approvals.json"
    "$HOME/.ssh/config"
    "$HOME/.zshrc"
)

# Create baseline dir if missing
mkdir -p "$BASELINE_DIR"

log_audit() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$AUDIT_LOG"
}

hash_file() {
    shasum -a 256 "$1" 2>/dev/null | awk '{print $1}' || echo ""
}

send_alert() {
    local message="⚠️ Config Audit Alert: $1"
    log_audit "$message"
    
    if [[ -n "${TELEGRAM_BOT_TOKEN:-}" && -n "${TELEGRAM_CHAT_ID:-}" ]]; then
        curl -fsSL -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
            -d "chat_id=${TELEGRAM_CHAT_ID}" \
            -d "text=${message}" > /dev/null 2>&1 || true
    fi
}

# Check each config file
for file in "${CONFIG_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        baseline_file="$BASELINE_DIR/$(basename "$file").hash"
        current_hash=$(hash_file "$file")
        
        if [[ -f "$baseline_file" ]]; then
            stored_hash=$(cat "$baseline_file")
            if [[ "$current_hash" != "$stored_hash" ]]; then
                send_alert "Config changed: $file"
                # Update baseline after alerting
                echo "$current_hash" > "$baseline_file"
            fi
        else
            # First run - create baseline
            echo "$current_hash" > "$baseline_file"
            log_audit "Baseline created for $file"
        fi
    fi
done

log_audit "Config audit complete"