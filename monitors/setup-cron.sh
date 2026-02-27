#!/bin/bash
# Setup cron jobs for B.O.B. security monitors
# Run this script to activate automated monitoring

CRON_FILE="/tmp/bob-monitors.cron"
MONITOR_DIR="/Users/campoffice/.openclaw/workspace/monitors"

# Build cron entries
cat > "$CRON_FILE" << EOF
# B.O.B. Security Monitors
# Added: $(date)

# SSH brute force check - every 10 minutes
*/10 * * * * cd "$MONITOR_DIR" && /bin/bash "$MONITOR_DIR/ssh-monitor.sh" >> "$MONITOR_DIR/cron.log" 2>&1

# Disk space check - every hour
0 * * * * cd "$MONITOR_DIR" && /bin/bash "$MONITOR_DIR/disk-monitor.sh" >> "$MONITOR_DIR/cron.log" 2>&1

# Config audit - daily at 9 AM
0 9 * * * cd "$MONITOR_DIR" && /bin/bash "$MONITOR_DIR/config-audit.sh" >> "$MONITOR_DIR/cron.log" 2>&1
EOF

echo "=== Proposed cron entries ==="
cat "$CRON_FILE"
echo ""
echo "=== To activate, run: ==="
echo "crontab $CRON_FILE"
echo ""
echo "=== To verify ==="
echo "crontab -l"
echo ""
echo "=== Logs will be at ==="
echo "$MONITOR_DIR/cron.log"