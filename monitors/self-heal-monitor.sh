#!/bin/bash
# self-heal-monitor.sh — runs independently of OpenClaw
# Checks gateway + Mission Control health, alerts Billy via Telegram if anything is down
# Designed to survive OpenClaw crashes

BOT_TOKEN="8740959001:AAEDwsnuqIM8MJpc67EvlHMo4J6tw1ia3N8"
CHAT_ID="8246157834"
LOG_FILE="$HOME/.openclaw/workspace/logs/self-heal.log"
SENTINEL_FILE="$HOME/.openclaw/workspace/logs/self-heal-last-alert.txt"

# Rate limit: don't spam — only alert once per 30 minutes per issue
ALERT_COOLDOWN=1800

mkdir -p "$(dirname "$LOG_FILE")"

send_alert() {
  local msg="$1"
  local now
  now=$(date +%s)
  local last_alert=0

  if [[ -f "$SENTINEL_FILE" ]]; then
    last_alert=$(cat "$SENTINEL_FILE" 2>/dev/null || echo 0)
  fi

  local elapsed=$((now - last_alert))
  if [[ $elapsed -lt $ALERT_COOLDOWN ]]; then
    echo "$(date): Alert suppressed (cooldown ${elapsed}s < ${ALERT_COOLDOWN}s): $msg" >> "$LOG_FILE"
    return
  fi

  echo "$now" > "$SENTINEL_FILE"
  echo "$(date): ALERT SENT: $msg" >> "$LOG_FILE"

  curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
    -d "chat_id=${CHAT_ID}" \
    -d "text=${msg}" \
    -d "parse_mode=HTML" \
    > /dev/null 2>&1
}

ISSUES=()

# --- Check 1: OpenClaw Gateway ---
GW_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://127.0.0.1:18789/status 2>/dev/null)
if [[ "$GW_STATUS" != "200" ]]; then
  ISSUES+=("❌ OpenClaw Gateway is down (HTTP $GW_STATUS)")
  echo "$(date): Gateway down — HTTP $GW_STATUS" >> "$LOG_FILE"
  # Attempt restart
  launchctl kickstart -k "gui/$(id -u)/ai.openclaw.gateway" > /dev/null 2>&1
  echo "$(date): Attempted gateway restart via launchctl" >> "$LOG_FILE"
fi

# --- Check 2: Mission Control ---
MC_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://127.0.0.1:3000 2>/dev/null)
if [[ "$MC_STATUS" != "200" ]]; then
  ISSUES+=("❌ Mission Control is down (HTTP $MC_STATUS)")
  echo "$(date): Mission Control down — HTTP $MC_STATUS" >> "$LOG_FILE"
  # Attempt restart
  launchctl kickstart -k "gui/$(id -u)/ai.openclaw.missioncontrol" > /dev/null 2>&1
  echo "$(date): Attempted Mission Control restart via launchctl" >> "$LOG_FILE"
fi

# --- Check 3: Disk space (critical threshold 95%) ---
DISK_USE=$(df / | awk 'NR==2 {gsub("%",""); print $5}')
if [[ "$DISK_USE" -ge 95 ]]; then
  ISSUES+=("⚠️ Disk usage critical: ${DISK_USE}%")
fi

# --- Send alert if any issues ---
if [[ ${#ISSUES[@]} -gt 0 ]]; then
  MSG="🚨 <b>FBCA Self-Heal Alert</b> — $(date '+%Y-%m-%d %H:%M CST')"$'\n\n'
  for issue in "${ISSUES[@]}"; do
    MSG+="${issue}"$'\n'
  done
  MSG+=$'\n'"Auto-restart attempted. Check Mission Control if issues persist."
  send_alert "$MSG"
else
  echo "$(date): All systems OK" >> "$LOG_FILE"
fi
